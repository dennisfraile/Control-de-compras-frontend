import client from './client';

export const getRecipeSuggestions = () => client.get('/recipes/suggestions').then(r => r.data);
