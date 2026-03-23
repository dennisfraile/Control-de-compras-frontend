import client from './client';

export const getReportSummary = (period: 'week' | 'month') =>
  client.get(`/reports/summary?period=${period}`).then(r => r.data);
