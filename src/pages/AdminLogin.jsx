import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Card } from "@mui/material";
import logo from "./logo.png";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../axios/axiosInstance";

const AdminLogin = () => {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/auth/login", { username, password });
      console.log("Login successful", response.data);

      const token = response.data.access_token;
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;

      if (response.data.userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/" + response.data.routeName);
      }
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
    <div className="h-screen flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-end px-6 sm:pr-24 bg-[#f9f3f2] relative">
      {/* Background Container for Stripes */}
      <div className="absolute inset-0 flex">
        <div className="h-full w-[10vw] min-w-[40px] bg-red-500"></div>
        <div className="h-full w-[6vw] min-w-[30px] bg-blue-500"></div>
        <div className="h-full w-[6vw] min-w-[30px] bg-yellow-500"></div>
      </div>

      {/* Logo - Centered on Mobile, Top-Right on Desktop */}
      <div className="absolute top-8 sm:top-10 sm:right-10 flex justify-center sm:justify-end w-full sm:w-auto">
        <img src={logo} alt="AdSpace Logo" className="w-20 sm:w-32" />
      </div>

      {/* Login Box - Centered on Mobile, Right on Desktop */}
      <Card className="p-8 shadow-md rounded-md border border-gray-400 w-full max-w-xs sm:max-w-md z-10 bg-white bg-opacity-90">
        <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">Log in</h2>
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
    </div>
  );
};

export default AdminLogin;
