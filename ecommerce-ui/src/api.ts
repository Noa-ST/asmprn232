import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7022/api", // sửa thành URL backend sau khi deploy
});

export default api;
