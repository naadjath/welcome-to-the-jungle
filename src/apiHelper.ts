// API Helper - utilise la variable d'environnement pour l'URL de base
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || '/api';
};

export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const baseUrl = getApiUrl();
  const url = endpoint.startsWith('/api') 
    ? `${baseUrl}${endpoint}` 
    : `${baseUrl}/api${endpoint}`;
  
  return fetch(url, options);
};
