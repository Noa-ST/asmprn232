import axios from "axios";

const api = axios.create({
  baseURL: "https://asmprn232-pro.onrender.com/api",
});

export default api;
