import axios, { AxiosInstance } from "axios";
import { ACCESS_TOKEN, API_URL } from "./config";

const createAxiosInstance = (): AxiosInstance => {
  /**
   * Create Axios Instance
   */
  const axiosInstance = axios.create({
    baseURL: `${API_URL}`,
    headers: {
      authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    /* ----------------------------- API Call Start ----------------------------- */
    /* eslint-disable no-console */
    console.log("[===== Started API Call =====]");
    return config;
  });

  axiosInstance.interceptors.response.use((response) => {
    /* ------------------------------ API Call End ------------------------------ */
    console.log("[===== Ended API Call =====]");
    return response;
  });

  return axiosInstance;
};

export default createAxiosInstance;
