import client from './client';

export const getBudgetStatus = () => client.get('/budgets/current').then(r => r.data);
export const updateBudget = (data: { amount: number; period: string }) =>
  client.put('/budgets', data).then(r => r.data);
