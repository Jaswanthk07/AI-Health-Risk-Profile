import { useState, useEffect } from 'react';
import { FileText, Stethoscope, Loader2, CheckCircle2, ActivitySquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { FileUpload } from '@/components/FileUpload';
import { TextInput } from '@/components/TextInput';
import { RiskAssessment } from '@/components/RiskAssessment';
import { useOCR } from '@/hooks/useOCR';
import { analyzeHealthRisk, RiskAnalysisResult } from '@/services/riskAnalysis';
import heroImage from '@/assets/hero-medical.jpg';

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<RiskAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { processImage, isProcessing: isOCRProcessing, progress, error: ocrError } = useOCR();
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      setAnalysisResult(null);
      // Show preview of selected image
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      
      toast({
        title: "Processing Image",
        description: "Extracting text from your medical document...",
      });

      const ocrResult = await processImage(file);
      
      if (!ocrResult.text.trim()) {
        toast({
          title: "No Text Found",
          description: "Could not extract readable text from the image. Please try a clearer image.",
          variant: "destructive"
        });
        return;
      }

      await handleTextAnalysis(ocrResult.text);
      
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Failed to process image",
        variant: "destructive"
      });
    }
  };

  const handleTextAnalysis = async (text: string) => {
    try {
      setIsAnalyzing(true);
      
      toast({
        title: "Analyzing Text",
        description: "Running health risk assessment...",
      });

      const result = await analyzeHealthRisk(text);
      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: `Risk level: ${result.riskLevel.toUpperCase()} (${result.riskScore}% risk score)`,
      });
      
    } catch (error) {
      console.error('Analysis Error:', error);
      toast({
        title: "Analysis Failed", 
        description: error instanceof Error ? error.message : "Failed to analyze text",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isProcessing = isOCRProcessing || isAnalyzing;

  // Cleanup object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero border-b border-border">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Medical health technology interface"
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                <Stethoscope className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Health Risk{' '}
              <span className="text-primary">Profiler</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Upload medical documents or enter health data to get instant AI-powered risk assessments 
              and personalized health recommendations powered by advanced OCR and machine learning.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <div className="flex items-center gap-3 bg-secondary/50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm font-medium">Secure OCR Processing</span>
              </div>
              <div className="flex items-center gap-3 bg-secondary/50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">AI Risk Analysis</span>
              </div>
              <div className="flex items-center gap-3 bg-secondary/50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-sm font-medium">Clinical Recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Processing Status */}
          {isProcessing && (
            <Card className="border-primary/30 bg-secondary/30 shadow-glow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">
                      {isOCRProcessing ? progress.status || 'Processing image...' : 'Analyzing health data...'}
                    </p>
                    {isOCRProcessing && progress.progress > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Progress: {Math.round(progress.progress)}%
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Input Section */}
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary">
              <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="w-4 h-4" />
                Upload Document
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="w-4 h-4" />
                Enter Text
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <FileUpload 
                onFileSelect={handleFileUpload}
                isProcessing={isProcessing}
                acceptedTypes="image/png,image/jpeg,image/jpg"
              />
              {imagePreview && (
                <div className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-semibold mb-2">Selected Image</div>
                      <img src={imagePreview} alt="Selected document" className="max-h-64 rounded-md border border-border object-contain" />
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="text">
              <TextInput 
                onTextSubmit={handleTextAnalysis}
                isProcessing={isProcessing}
                placeholder="Enter your medical data, lab results, or health information here..."
              />
            </TabsContent>
          </Tabs>

          {/* Pipeline Steps */}
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOCRProcessing ? 'bg-warning' : analysisResult ? 'bg-success' : 'bg-secondary'}`}>
                    {(analysisResult || !isOCRProcessing) ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Loader2 className="w-4 h-4 text-white animate-spin" />}
                  </div>
                  <div>
                    <div className="font-semibold">OCR</div>
                    <div className="text-sm text-muted-foreground">Extract text from image</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAnalyzing && !analysisResult ? 'bg-warning' : analysisResult ? 'bg-success' : 'bg-secondary'}`}>
                    {analysisResult ? <CheckCircle2 className="w-4 h-4 text-white" /> : (isAnalyzing ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <ActivitySquare className="w-4 h-4 text-white" />)}
                  </div>
                  <div>
                    <div className="font-semibold">Factor Extraction</div>
                    <div className="text-sm text-muted-foreground">Identify lifestyle risk factors</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${analysisResult ? 'bg-success' : (isAnalyzing ? 'bg-warning' : 'bg-secondary')}`}>
                    {analysisResult ? <CheckCircle2 className="w-4 h-4 text-white" /> : (isAnalyzing ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <ActivitySquare className="w-4 h-4 text-white" />)}
                  </div>
                  <div>
                    <div className="font-semibold">Risk & Recommendations</div>
                    <div className="text-sm text-muted-foreground">Score and actionable guidance</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {analysisResult && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
                <p className="text-muted-foreground">
                  Your health risk assessment is complete
                </p>
              </div>
              
              <RiskAssessment result={analysisResult} />
            </div>
          )}

          {/* Getting Started */}
          {!analysisResult && !isProcessing && (
            <Card className="bg-gradient-card shadow-card-medical border-border">
              <CardContent className="p-10 text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow">
                  <Stethoscope className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">Ready to Analyze Your Health Data</h3>
                  <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                    Choose an option above to upload a medical document or enter health data directly 
                    for instant AI-powered risk analysis.
                  </p>
                </div>
                <div className="pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-primary">Supported formats:</strong> PNG, JPG images • Lab reports • Medical records • Health data
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;