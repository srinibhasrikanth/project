// axiosInstance.js

import axios from "axios";

const Axios = axios.create({
  baseURL: "http://api.example.com", // Your API base URL
  timeout: 5000, // Request timeout
});






// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any request headers or transformations here
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle response errors
    return Promise.reject(error);
  }
);

export default Axios;
