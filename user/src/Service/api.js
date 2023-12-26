import axios from "axios";
// const url = "http://localhost:4000";
const url = "https://eccomerce-n7o5.onrender.com";

export default axios.create({
  baseURL: url,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});
