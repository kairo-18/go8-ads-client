import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance"; // Import the axios instance

// Create the context
const UserContext = createContext();

// Create the provider component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  }, []);

  const login = (token) => {
    localStorage.setItem("token", token); // Store the token in localStorage
    // Token will be automatically sent with axiosInstance for each request
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    delete axiosInstance.defaults.headers["Authorization"]; // Remove the token from axiosInstance headers
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
