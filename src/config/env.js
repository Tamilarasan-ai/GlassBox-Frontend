const env = {
  ENV: process.env.REACT_APP_ENV,
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  DEBUG: process.env.REACT_APP_DEBUG === "true",
};

export default env;
