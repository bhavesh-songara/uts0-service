import axios, { AxiosRequestConfig } from "axios";

const fetcher = async (payload: AxiosRequestConfig) => {
  try {
    const response = await axios(payload);
    return {
      data: response.data,
      error: null,
      headers: response.headers,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error?.response?.data,
    };
  }
};

export default fetcher;
