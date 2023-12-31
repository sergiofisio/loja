import axios from "axios";
// const url = "http://localhost:4000";
const url = "https://server-loja-gfrs.onrender.com";

export default axios.create({
  baseURL: url,
  timeout: 90000,
  headers: { "Content-Type": "application/json" },
});
