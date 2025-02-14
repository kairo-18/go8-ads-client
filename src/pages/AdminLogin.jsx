import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Card } from "@mui/material";
import logo from "./logo.png";
import { useContext } from "react";
import { UserContext } from "../context/UserContext"; // Import UserContext
import axiosInstance from "../axios/axiosInstance";

const AdminLogin = () => {
  const { login } = useContext(UserContext); // Access login function from context
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });
      console.log("Login successful", response.data);
      
        // On successful login, the backend will return the token
        const token = response.data.access_token;

        // Store the token in localStorage for future requests
        localStorage.setItem("token", token);
  
        // Automatically set the Authorization header using the axios instance
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;

      // Navigate to dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="h-screen flex items-center justify-end pr-24 bg-[#f9f3f2] relative">
      {/* Left Color Stripes */}
      <div className="absolute left-0 top-0 h-full w-12 bg-red-500"></div>
      <div className="absolute left-16 top-0 h-full w-6 bg-blue-500"></div>
      <div className="absolute left-28 top-0 h-full w-6 bg-yellow-500"></div>

      {/* Login Box */}
      <Card
        className="p-8 shadow-md rounded-md border border-gray-400 w-11/12 sm:w-96"
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
      >
        <h2 className="text-lg font-semibold mb-4">Log in</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="dense"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button fullWidth variant="contained" color="primary" className="mt-4" onClick={handleLogin}>
          Log in
        </Button>
      </Card>

      {/* Logo */}
      <div className="absolute top-8 right-10">
        <img src={logo} alt="AdSpace Logo" className="w-32" />
      </div>
    </div>
  );
};

export default AdminLogin;
