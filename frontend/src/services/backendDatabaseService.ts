import axios from 'axios';
import { DatabaseService, RiskAnalysisResult } from './riskAnalysis';

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

export class BackendDatabaseService implements DatabaseService {
  async analyzeHealthRisk(text: string): Promise<RiskAnalysisResult> {
    // We first call /parse to extract answers, then call /risk
    const userId = localStorage.getItem('hp_user_id') || 'anonymous';

    const parseResp = await api.post('/parse', { userId, text });
    if (parseResp.data && parseResp.data.status === 'incomplete_profile') {
      throw new Error(parseResp.data.reason || 'Profile is incomplete');
    }
    const { answers, patientInfo } = parseResp.data;

    const riskResp = await api.post('/risk', { userId, answers });
    const { risk_level, score, recommendations, factors, rationale } = riskResp.data;

    // Map response into RiskAnalysisResult expected by the UI
    const result: RiskAnalysisResult = {
      riskLevel: risk_level,
      riskScore: score,
      parsedData: {
        patientInfo: {
          name: patientInfo?.name,
          age: patientInfo?.age || answers?.age,
          gender: patientInfo?.gender,
          phone: patientInfo?.phone,
          email: patientInfo?.email,
          address: patientInfo?.address,
        },
      },
      recommendations: recommendations.map((r: string) => ({
        priority: score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low',
        action: r,
        description: r,
      })),
      summary: `Risk ${risk_level} (${score}). Recommendations: ${recommendations.join(', ')}`,
      factors,
      rationale,
    } as RiskAnalysisResult;

    return result;
  }

  async saveAnalysisResult(_result: RiskAnalysisResult): Promise<void> {
    // Saving is handled by backend endpoints; nothing to do here
    return;
  }

  async getPatientHistory(_patientId: string): Promise<RiskAnalysisResult[]> {
    // Optional: Implement if you add a GET endpoint in backend
    return [];
  }

  async downloadReport(userId: string): Promise<void> {
    try {
      const response = await api.get(`/report/${userId}`, {
        responseType: 'blob',
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `health-report-${userId}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error('Failed to download report');
    }
  }
}
