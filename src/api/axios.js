import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // example: "https://snapshare-backend.onrender.com/api"
  withCredentials: true, // ✅ required for cookie-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
