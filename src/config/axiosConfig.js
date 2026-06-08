import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized: Redirect to login or refresh token');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL, // Replace with your API base URL
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
    
//     // Add other default headers here (like Authorization if needed)
//   },
// });


// // Add a request interceptor (optional)
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // You can add authorization token here if needed
//     const token = localStorage.getItem('token'); // Or get from Redux/store
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add a response interceptor (optional)
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle common errors globally
//     if (error.response?.status === 401) {
//       // Redirect to login or refresh token
//       console.error('Unauthorized');
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
