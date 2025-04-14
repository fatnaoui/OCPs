import axios from 'axios';

// Create an instance of axios with the base URL
const api = axios.create({
  baseURL: "https://8000-01jn2a4rdakmhm1hazd2318er7.cloudspaces.litng.ai"
});

// Export the Axios instance
export default api;