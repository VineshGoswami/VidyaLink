// src/contexts/AuthContext.jsx
import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";

export const AuthContext = createContext({});

// Update this baseURL to point to your auth routes
const client = axios.create({
  baseURL: `${server}/api/v1/auth`, // backend auth route
  withCredentials: true,            // include cookies if needed
});

export const AuthProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const [userData, setUserData] = useState(authContext);
  const router = useNavigate();

  // ---------------- Register ----------------
  const handleRegister = async (name, username, password) => {
    try {
      const res = await client.post("/register", { name, username, password });
      if (res.status === httpStatus.CREATED) {
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.msg || err.response?.data?.error || err.message || "Something went wrong";
      console.error("Register error:", message);
      return { success: false, message };
    }
  };

  // ---------------- Login ----------------
  const handleLogin = async (username, password) => {
    try {
      const res = await client.post("/login", { username, password });
      if (res.status === httpStatus.OK) {
        localStorage.setItem("token", res.data.token);
        setUserData({ username }); // optional: store user info
        router("/home");
        return { success: true, data: res.data };
      }
    } catch (err) {
      const message = err.response?.data?.msg || err.response?.data?.error || err.message || "Something went wrong";
      console.error("Login error:", message);
      return { success: false, message };
    }
  };

  // ---------------- Get User History ----------------
  const getHistoryOfUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await client.get("/get_all_activity", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.msg || err.response?.data?.error || err.message || "Something went wrong";
      console.error("History fetch error:", message);
      return { success: false, message };
    }
  };

  // ---------------- Add to User History ----------------
  const addToUserHistory = async (meetingCode) => {
    try {
      const token = localStorage.getItem("token");
      const res = await client.post(
        "/add_to_activity",
        { meeting_code: meetingCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.msg || err.response?.data?.error || err.message || "Something went wrong";
      console.error("Add history error:", message);
      return { success: false, message };
    }
  };

  // ---------------- Context Value ----------------
  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToUserHistory,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
