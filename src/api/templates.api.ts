import client from './client';

export const getTemplates = () => client.get('/shopping-templates').then(r => r.data);
export const createTemplate = (data: any) => client.post('/shopping-templates', data).then(r => r.data);
export const deleteTemplate = (id: string) => client.delete(`/shopping-templates/${id}`);
