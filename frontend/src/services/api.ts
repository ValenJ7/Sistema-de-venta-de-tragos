import axios, { AxiosError,type AxiosRequestConfig } from "axios";
import { useAppStore } from "../store/useAppStore";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true, // 👈 necesario para refreshToken cookie
});

// =======================
// Request interceptor
// =======================
api.interceptors.request.use((config) => {
  const token = useAppStore.getState().accessToken;

  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  return config;
});

// =======================
// Refresh token handling
// =======================
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const res = await api.post("/auth/refresh.php");
  const newToken = res.data?.accessToken as string | undefined;

  if (!newToken) {
    throw new Error("No accessToken returned from refresh");
  }

  useAppStore.getState().setAccessToken(newToken);
  return newToken;
}

// =======================
// Response interceptor
// =======================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const msg = error.response?.data?.message as string | undefined;

    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const isTokenExpired =
      status === 401 &&
      typeof msg === "string" &&
      msg.toLowerCase().includes("expired");

    if (!isTokenExpired) {
      return Promise.reject(error);
    }

    // evitar loop infinito
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise!;
      originalRequest.headers = originalRequest.headers ?? {};
      (originalRequest.headers as any).Authorization = `Bearer ${newToken}`;

      return api.request(originalRequest);
    } catch (e) {
      // refresh falló → logout
      useAppStore.getState().logout();
      return Promise.reject(error);
    }
  }
);

export default api;
