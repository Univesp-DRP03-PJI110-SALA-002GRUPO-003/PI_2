import axios from "axios";
import config from "./config";

export const client = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    // "Content-Type": "application/json",
    // "x-api-key": "reqres-free-v1"
  },
});

const getToken = (): string => {
  return localStorage.getItem("Authentication-Token")?.replace(/^"|"$/g, "") || "";
};

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    if (config.headers) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = new axios.AxiosHeaders({
        Authorization: `Bearer ${token}`,
      });
    }
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (
    //   error.response?.status === 401) {
    //   localStorage.removeItem("Authentication-Token");
    //   localStorage.removeItem("Authenticated-User");

    //   window.location.href = "/login";
    // }
    return Promise.reject(error.response.data);
  }
);
