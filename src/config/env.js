const env = {
  ENV: import.meta.env.MODE,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  DEBUG: import.meta.env.DEV,
};

export default env;
