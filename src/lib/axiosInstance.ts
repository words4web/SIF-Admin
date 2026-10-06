import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { store } from "@/store";
import { clearAuth, setAccessToken } from "@/store/authSlice";
import { API_ROUTES } from "@/constants/api";
import { ROUTES } from "@/constants/routes";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api/v1";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState() as any;
    const accessToken = state.auth.accessToken;
    const locale = state.locale?.locale;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (locale) {
      config.headers["Accept-Language"] = locale;
    }

    config.headers["x-platform"] = "web";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthPage =
      typeof window !== "undefined" &&
      window.location.pathname === ROUTES.LOGIN;

    if (error.response?.status === 401) {
      if (isAuthPage) {
        store.dispatch(clearAuth());
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const isAuthEndpoint =
          originalRequest?.url?.includes(API_ROUTES.AUTH.LOGIN) ||
          originalRequest?.url?.includes(API_ROUTES.AUTH.REFRESH_TOKEN) ||
          originalRequest?.url?.includes(API_ROUTES.AUTH.LOGOUT);

        if (isAuthEndpoint) {
          isRefreshing = false;
          const isLogoutRequest = originalRequest?.url?.includes(
            API_ROUTES.AUTH.LOGOUT,
          );
          if (!isLogoutRequest) {
            store.dispatch(clearAuth());
            if (typeof window !== "undefined") {
              const currentPath = window.location.pathname;
              if (currentPath !== ROUTES.LOGIN) {
                window.location.href = ROUTES.LOGIN;
              }
            }
          }
          return Promise.reject(error);
        }

        try {
          const response = await axios.post(
            `${API_BASE_URL}${API_ROUTES.AUTH.REFRESH_TOKEN}`,
            {},
            {
              timeout: 30000,
              withCredentials: true,
            },
          );

          const newAccessToken = response.data?.data?.accessToken;

          if (newAccessToken) {
            store.dispatch(setAccessToken(newAccessToken));
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            return axiosInstance(originalRequest);
          } else {
            throw new Error("New access token not found in refresh response");
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          store.dispatch(clearAuth());
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            if (currentPath !== ROUTES.LOGIN) {
              window.location.href = ROUTES.LOGIN;
            }
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
