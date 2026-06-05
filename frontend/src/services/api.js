import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

export async function get(path) {
  try {
    const res = await api.get(path);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.erro || err.message || "Network error";
    throw new Error(msg);
  }
}

export async function post(path, body) {
  try {
    const res = await api.post(path, body);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.erro || err.message || "Network error";
    throw new Error(msg);
  }
}

export default { get, post, api };
