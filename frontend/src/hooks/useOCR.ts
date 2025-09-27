import { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
}

export interface OCRProgress {
  status: string;
  progress: number;
}

export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OCRProgress>({ status: '', progress: 0 });
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(async (file: File): Promise<OCRResult> => {
    setIsProcessing(true);
    setError(null);
    setProgress({ status: 'Initializing OCR engine...', progress: 0 });

    try {
      // Create Tesseract worker
      const worker = await createWorker('eng', 1, {
        logger: m => {
          setProgress({
            status: m.status,
            progress: m.progress * 100
          });
        }
      });

      setProgress({ status: 'Processing image...', progress: 80 });

      // Perform OCR
      const { data } = await worker.recognize(file);
      
      setProgress({ status: 'Completed', progress: 100 });

      // Cleanup
      await worker.terminate();

      const result: OCRResult = {
        text: data.text.trim(),
        confidence: data.confidence
      };

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OCR processing failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
      // Reset progress after a short delay
      setTimeout(() => {
        setProgress({ status: '', progress: 0 });
      }, 2000);
    }
  }, []);

  return {
    processImage,
    isProcessing,
    progress,
    error
  };
};