import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL!,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/google'
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/unauthorized';
        return Promise.reject(refreshError);
      }
    }

    if (
      error.response?.status === 401 &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/google'
    ) {
      window.location.href = '/unauthorized';
    }

    return Promise.reject(error);
  }
);

export default api;
