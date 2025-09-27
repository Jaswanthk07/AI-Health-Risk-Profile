import { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
  acceptedTypes?: string;
}

export const FileUpload = ({ onFileSelect, isProcessing = false, acceptedTypes = "image/*" }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/') && (file.type === 'image/png' || file.type === 'image/jpeg')) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
            "hover:border-primary hover:bg-primary/5",
            isDragOver && "border-primary bg-primary/10 scale-[0.98]",
            isProcessing && "pointer-events-none opacity-60",
            "bg-gradient-card shadow-card-medical"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          
          <div className="flex flex-col items-center space-y-4">
            {isProcessing ? (
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            ) : (
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-medical">
                <Upload className="w-8 h-8 text-white" />
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {isProcessing ? 'Processing Document...' : 'Upload Medical Document'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedFile ? (
                  <span className="flex items-center justify-center gap-2">
                    {selectedFile.type.startsWith('image/') ? (
                      <ImageIcon className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    {selectedFile.name}
                  </span>
                ) : (
                  'Drag and drop your file here, or click to browse'
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PNG and JPG images up to 10MB
              </p>
            </div>
            
            {!selectedFile && !isProcessing && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-border hover:bg-secondary"
              >
                Choose File
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};