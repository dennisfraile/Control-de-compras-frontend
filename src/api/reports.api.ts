import client from './client';

export interface ConsumptionDataPoint {
  period: string;
  quantity: number;
  totalSpent: number;
}

export interface ConsumptionHistory {
  productId: string;
  productName: string;
  weeklyConsumption: ConsumptionDataPoint[];
  monthlyConsumption: ConsumptionDataPoint[];
  averageWeeklyConsumption: number;
  averageMonthlyConsumption: number;
}

export const getReportSummary = (period: 'week' | 'month') =>
  client.get(`/reports/summary?period=${period}`).then(r => r.data);

export const reportsApi = {
  getSummary: async (period = 'month') => {
    const { data } = await client.get('/reports/summary', { params: { period } });
    return data;
  },

  getStatistics: async () => {
    const { data } = await client.get('/reports/statistics');
    return data;
  },

  getConsumptionHistory: async (productId: string): Promise<ConsumptionHistory> => {
    const { data } = await client.get<ConsumptionHistory>(`/reports/consumption-history/${productId}`);
    return data;
  },
};
