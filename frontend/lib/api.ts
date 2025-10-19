import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export function apiClient(token?: string | null) {
  return axios.create({
    baseURL: API,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
