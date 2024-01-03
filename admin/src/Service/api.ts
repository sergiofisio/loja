import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_URL_DEPLOY,
  timeout: 90000,
  headers: { "Content-Type": "application/json" },
});
