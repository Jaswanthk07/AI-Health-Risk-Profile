// Database service interface - implement this with your database connection
export interface DatabaseService {
  analyzeHealthRisk(text: string): Promise<RiskAnalysisResult>;
  saveAnalysisResult(result: RiskAnalysisResult): Promise<void>;
  getPatientHistory(patientId: string): Promise<RiskAnalysisResult[]>;
}

export interface RiskAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  parsedData: {
    patientInfo?: {
      name?: string;
      age?: number;
      gender?: string;
      phone?: string;
      email?: string;
      address?: string;
    };
    vitals?: {
      bloodPressure?: string;
      heartRate?: number;
      temperature?: number;
      oxygenSaturation?: number;
    };
    labResults?: {
      [key: string]: {
        value: number | string;
        unit?: string;
        normalRange?: string;
        status?: 'normal' | 'abnormal';
      };
    };
    medications?: string[];
    conditions?: string[];
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    description: string;
  }[];
  summary: string;
  factors?: string[];
  rationale?: string[];
}

// Database service instance - replace with your actual database implementation
let databaseService: DatabaseService | null = null;

/**
 * Initialize the database service
 * Call this function with your database implementation before using analyzeHealthRisk
 */
export const initializeDatabaseService = (service: DatabaseService): void => {
  databaseService = service;
};

/**
 * Analyze health risk using the configured database service
 * @param text - The health data text to analyze
 * @returns Promise<RiskAnalysisResult> - The analysis result from your database/AI service
 */
export const analyzeHealthRisk = async (text: string): Promise<RiskAnalysisResult> => {
  if (!databaseService) {
    throw new Error(
      'Database service not initialized. Please call initializeDatabaseService() with your database implementation first.'
    );
  }

  try {
    // Call your database service to analyze the health risk
    const result = await databaseService.analyzeHealthRisk(text);
    
    // Optionally save the result to your database
    await databaseService.saveAnalysisResult(result);
    
    return result;
  } catch (error) {
    console.error('Risk analysis failed:', error);
    throw new Error('Failed to analyze health risk. Please try again.');
  }
};

/**
 * Get patient history using the configured database service
 * @param patientId - The patient ID to get history for
 * @returns Promise<RiskAnalysisResult[]> - Array of historical analysis results
 */
export const getPatientHistory = async (patientId: string): Promise<RiskAnalysisResult[]> => {
  if (!databaseService) {
    throw new Error(
      'Database service not initialized. Please call initializeDatabaseService() with your database implementation first.'
    );
  }

  try {
    return await databaseService.getPatientHistory(patientId);
  } catch (error) {
    console.error('Failed to get patient history:', error);
    throw new Error('Failed to retrieve patient history. Please try again.');
  }
};