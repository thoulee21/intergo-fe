import axios, { AxiosRequestConfig } from "axios";
import { LRUCache } from "lru-cache";

declare module "axios" {
  export interface AxiosRequestConfig {
    noCache?: boolean;
    retryCount?: number;
    maxRetries?: number;
    retryDelay?: number;
    retryCondition?: (error: any) => boolean;
  }
}

const DEFAULT_RETRY_CONFIG = {
  maxRetries: 5, 
  retryDelay: 1000, 
  retryCondition: (error: any) => {
    const status = error.response.status;

    if (!error.response) {
      return true;
    }

    if (status >= 400 && status < 500) {
      return false;
    }

    return status >= 500;
  },
};

const delay = (ms: number, retryCount: number = 0): Promise<void> => {
  const exponentialDelay = ms * Math.pow(2, retryCount);
  const jitter = Math.random() * 1000; 
  const finalDelay = Math.min(exponentialDelay + jitter, 30000); 

  return new Promise((resolve) => setTimeout(resolve, finalDelay));
};

const apiCache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 10,
});

const generateCacheKey = (config: AxiosRequestConfig): string => {
  const { url, params, baseURL } = config;
  const fullUrl = baseURL ? `${baseURL}${url}` : url;
  return `${fullUrl}?${JSON.stringify(params || {})}`;
};

export const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000",
  timeout: 2 * 60 * 1000, 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export const clearCache = (urlPattern?: RegExp) => {
  if (!urlPattern) {
    apiCache.clear();
  } else {
    const keys = Array.from(apiCache.keys());
    keys.forEach((key) => {
      if (urlPattern.test(key)) {
        apiCache.delete(key);
      }
    });
  }
};

apiClient.interceptors.request.use(async (config) => {
  if (config.url?.includes("/auth/validate-session")) {
    const cacheKey = generateCacheKey(config);
    const cachedResponse = apiCache.get(cacheKey);

    if (cachedResponse) {
      return Promise.reject({
        __CACHE_HIT__: true,
        cachedResponse,
      });
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (
      response.config.url?.includes("/auth/validate-session") &&
      !response.config.noCache
    ) {
      const cacheKey = generateCacheKey(response.config);

      apiCache.set(cacheKey, {
        data: response.data,
        status: response.status,
        headers: response.headers,
        config: response.config,
      });
    }
    return response;
  },

  async (error) => {
    if (error.__CACHE_HIT__) {
      return Promise.resolve(error.cachedResponse);
    }

    const config = error.config;

    if (!config.retryCount) {
      config.retryCount = 0;
    }

    const maxRetries = config.maxRetries ?? DEFAULT_RETRY_CONFIG.maxRetries;
    const retryDelay = config.retryDelay ?? DEFAULT_RETRY_CONFIG.retryDelay;
    const retryCondition =
      config.retryCondition ?? DEFAULT_RETRY_CONFIG.retryCondition;

    const shouldRetry = config.retryCount < maxRetries && retryCondition(error);

    if (shouldRetry) {
      config.retryCount++;

      console.warn(
        `请求失败，正在进行第 ${config.retryCount} 次重试 (最多 ${maxRetries} 次)...`,
        {
          url: config.url,
          method: config.method,
          error: error.message,
        },
      );

      await delay(retryDelay, config.retryCount - 1);

      return apiClient(config);
    }

    if (
      error.response?.status === 401 &&
      error.response?.data?.error === "令牌已过期"
    ) {
      try {
        await apiClient.post("/auth/refresh-token");

        const originalRequest = error.config;
        return apiClient(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data &&
      error.response.data.status === "inactive"
    ) {
      if (typeof window !== "undefined") {
        alert("您的账户已被停用，请联系管理员。");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
