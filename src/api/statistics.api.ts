import client from './client';

export const getConsumptionStats = () => client.get('/reports/statistics').then(r => r.data);
