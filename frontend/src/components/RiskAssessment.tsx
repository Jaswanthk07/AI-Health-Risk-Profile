import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp, User, Activity, Pill, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RiskAnalysisResult } from '@/services/riskAnalysis';
import { BackendDatabaseService } from '@/services/backendDatabaseService';
import { cn } from '@/lib/utils';

interface RiskAssessmentProps {
  result: RiskAnalysisResult;
}

export const RiskAssessment = ({ result }: RiskAssessmentProps) => {
  const databaseService = new BackendDatabaseService();

  const handleDownloadReport = async () => {
    try {
      const userId = localStorage.getItem('hp_user_id') || 'anonymous';
      await databaseService.downloadReport(userId);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'muted';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return AlertTriangle;
      case 'medium': return AlertCircle;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const RiskIcon = getRiskIcon(result.riskLevel);
  const riskColor = getRiskColor(result.riskLevel);

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <Card className={cn("shadow-card-medical", `shadow-${riskColor}`)}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              `bg-gradient-${riskColor} shadow-${riskColor}`
            )}>
              <RiskIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Risk Assessment</h2>
              <p className="text-sm text-muted-foreground">Health analysis results</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-lg px-4 py-2 font-semibold capitalize",
                  `border-${riskColor} text-${riskColor}`
                )}
              >
                {result.riskLevel}
              </Badge>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <p className="text-3xl font-bold">{result.riskScore}%</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Risk Assessment</span>
              <span>{result.riskScore}%</span>
            </div>
            <Progress value={result.riskScore} className="h-3" />
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm leading-relaxed">{result.summary}</p>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleDownloadReport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Extracted Factors */}
      {(result.factors && result.factors.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Contributing Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.factors.map((f, idx) => (
                <Badge key={idx} variant="secondary" className="capitalize">{f}</Badge>
              ))}
            </div>
            {result.rationale && result.rationale.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="font-semibold mb-1">Rationale</div>
                <ul className="list-disc pl-5 space-y-1">
                  {result.rationale.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Parsed Data */}
      {(result.parsedData.patientInfo || result.parsedData.vitals) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {result.parsedData.patientInfo && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Demographics</h4>
                <div className="space-y-2">
                  {result.parsedData.patientInfo.name && (
                    <div className="flex justify-between">
                      <span className="text-sm">Name</span>
                      <span className="font-medium">{result.parsedData.patientInfo.name}</span>
                    </div>
                  )}
                  {result.parsedData.patientInfo.age && (
                    <div className="flex justify-between">
                      <span className="text-sm">Age</span>
                      <span className="font-medium">{result.parsedData.patientInfo.age} years</span>
                    </div>
                  )}
                  {result.parsedData.patientInfo.gender && (
                    <div className="flex justify-between">
                      <span className="text-sm">Gender</span>
                      <span className="font-medium capitalize">{result.parsedData.patientInfo.gender}</span>
                    </div>
                  )}
                  {result.parsedData.patientInfo.phone && (
                    <div className="flex justify-between">
                      <span className="text-sm">Phone</span>
                      <span className="font-medium">{result.parsedData.patientInfo.phone}</span>
                    </div>
                  )}
                  {result.parsedData.patientInfo.email && (
                    <div className="flex justify-between">
                      <span className="text-sm">Email</span>
                      <span className="font-medium">{result.parsedData.patientInfo.email}</span>
                    </div>
                  )}
                  {result.parsedData.patientInfo.address && (
                    <div className="flex justify-between">
                      <span className="text-sm">Address</span>
                      <span className="font-medium">{result.parsedData.patientInfo.address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {result.parsedData.vitals && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Vital Signs</h4>
                <div className="space-y-2">
                  {result.parsedData.vitals.bloodPressure && (
                    <div className="flex justify-between">
                      <span className="text-sm">Blood Pressure</span>
                      <span className="font-medium">{result.parsedData.vitals.bloodPressure} mmHg</span>
                    </div>
                  )}
                  {result.parsedData.vitals.heartRate && (
                    <div className="flex justify-between">
                      <span className="text-sm">Heart Rate</span>
                      <span className="font-medium">{result.parsedData.vitals.heartRate} bpm</span>
                    </div>
                  )}
                  {result.parsedData.vitals.temperature && (
                    <div className="flex justify-between">
                      <span className="text-sm">Temperature</span>
                      <span className="font-medium">{result.parsedData.vitals.temperature}°F</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conditions and Medications */}
      {(result.parsedData.conditions?.length || result.parsedData.medications?.length) && (
        <div className="grid md:grid-cols-2 gap-4">
          {result.parsedData.conditions && result.parsedData.conditions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Medical Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.parsedData.conditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="capitalize">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {result.parsedData.medications && result.parsedData.medications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.parsedData.medications.map((medication, index) => (
                    <Badge key={index} variant="outline" className="capitalize">
                      {medication}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.recommendations.map((rec, index) => (
            <div key={index} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                rec.priority === 'high' && "bg-gradient-danger shadow-danger",
                rec.priority === 'medium' && "bg-gradient-warning shadow-warning",
                rec.priority === 'low' && "bg-gradient-success shadow-success"
              )}>
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{rec.action}</h4>
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-xs",
                      rec.priority === 'high' && "border-danger text-danger",
                      rec.priority === 'medium' && "border-warning text-warning",
                      rec.priority === 'low' && "border-success text-success"
                    )}
                  >
                    {rec.priority} priority
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {rec.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};