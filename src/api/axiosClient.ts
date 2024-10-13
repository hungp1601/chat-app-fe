import { store } from 'app/store';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { authAction } from 'features/auth/authSlice';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const errorMess = error.response?.data?.message || error.message;
    console.log({ errorMess, store });
    if (error.response?.status === 401 && errorMess === 'jwt expired') {
      store.dispatch(authAction.refreshToken());
      return;
      // return Promise.(error);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
