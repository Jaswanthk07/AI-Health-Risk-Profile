import { useState } from 'react';
import { FileText, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
  isProcessing?: boolean;
  placeholder?: string;
}

export const TextInput = ({ 
  onTextSubmit, 
  isProcessing = false, 
  placeholder = "Enter or paste your medical text here..." 
}: TextInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim() && !isProcessing) {
      onTextSubmit(text.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          Direct Text Input
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[120px] resize-y border-2 focus:border-primary"
          disabled={isProcessing}
        />
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span className={text.length > 0 ? 'text-foreground' : ''}>
              {text.length} characters
            </span>
            {text.length > 0 && (
              <span className="ml-2 text-xs">
                Press Ctrl+Enter or click Send
              </span>
            )}
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!text.trim() || isProcessing}
            className="bg-gradient-primary shadow-medical hover:shadow-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};