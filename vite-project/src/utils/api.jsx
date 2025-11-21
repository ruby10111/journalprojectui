import axios from "axios";

export const api = axios.create({
  baseURL: "https://finalrepofrosprinboot-1.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token && !config.url.startsWith("/public")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
