import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api'
  // baseURL: 'http://localhost:8000/api'
});

// use below instance to not include authorization header in request
export const axiosInstance2 = axios.create({
  baseURL: '/api'
  // baseURL: 'http://localhost:8000/api'
});

axiosInstance.interceptors.request.use((config: any) => {
  const admin_secret = localStorage.getItem('ADMIN_SECRET_KEY');
  config.headers['x-admin-secret-key'] = admin_secret;
  return config;
});

// axiosInstance.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response.status === 401) {
//       window.location.assign('/login');
//     } else if (error.response.status === 403) {
//       window.location.assign('/signup');
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
