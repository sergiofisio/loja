import axios from "axios";

console.log("URL_DEPLOY", import.meta.env.VITE_URL_DEPLOY);

export default axios.create({
  baseURL: import.meta.env.VITE_URL_DEPLOY,
  timeout: 200000,
  headers: { "Content-Type": "application/json" },
});
