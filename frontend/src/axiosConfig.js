import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Attach token automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default instance;