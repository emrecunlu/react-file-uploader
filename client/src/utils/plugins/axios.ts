import axiosInstance from "axios";

const axios = axiosInstance.create({
  baseURL: import.meta.env.VITE_APP_SERVER_URL,
});

export default axios;
