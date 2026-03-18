import client from './client';

export const getSavingsAnalysis = () => client.get('/purchases/savings-analysis').then(r => r.data);
