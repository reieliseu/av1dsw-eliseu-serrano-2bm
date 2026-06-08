import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

function normalize(path) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export async function get(path, config) {
  try {
    const res = await api.get(normalize(path), config);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.erro || err.message || "Network error";
    throw new Error(msg);
  }
}

export async function post(path, body, config) {
  try {
    const res = await api.post(normalize(path), body, config);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.erro || err.message || "Network error";
    throw new Error(msg);
  }
}

export async function put(path, body, config) {
  try {
    const res = await api.put(normalize(path), body, config);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.erro || err.message || "Network error";
    throw new Error(msg);
  }
}

export async function del(path, config) {
  try {
    const res = await api.delete(normalize(path), config);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.erro || err.message || "Network error";
    throw new Error(msg);
  }
}

export default { get, post, put, del, api };
