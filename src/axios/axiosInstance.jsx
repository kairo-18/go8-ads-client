import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "/", // Adjust to your proxy base URL
});

// Add a request interceptor to attach the token if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(token); // Debugging: Check if the token is available
    
    // Only add token to headers if it's available
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Add token to headers
    } else {
      // Optionally, you can log that no token is set or take actions if needed
      console.log("No token found in localStorage.");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle error if any
  }
);

export default axiosInstance;
