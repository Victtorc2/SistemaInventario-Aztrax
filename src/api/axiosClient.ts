

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getToken, removeToken } from "@/utils/auth";

/** Evento global emitido cuando el backend responde 401 (sesión inválida). */
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

const baseURL = import.meta.env.VITE_API_URL ?? "https://web-production-1e1c3.up.railway.app/";

export const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request: inyecta el Bearer token ---------------------------------------
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- Response: maneja expiración / token inválido ---------------------------
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // El token ya no es válido: lo limpiamos y avisamos a la app.
      removeToken();
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);
