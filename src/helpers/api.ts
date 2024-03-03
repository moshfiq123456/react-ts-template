import axios from "axios";
import { performResponseData } from "../utils/api";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  },
});

const onResponseSuccess = (response: any) => {
  const { data } = response;

  return Promise.resolve({
    ...response,
    data: performResponseData(data),
  });
};
const onResponseError = (error: any) => {
  if (error?.response?.status === 401 && error?.config?.url !== URLS.SIGN_OUT) {
    removeStorage(LS_KEYS.AUTH_TOKEN);
    const redirectPath =
      process.env.REACT_APP_AUTH_GRANT_FLOW === "true"
        ? ROUTES.HOME
        : ROUTES.SIGN_IN;
    window.location.replace(redirectPath);
  }

  if (error?.response?.status === 403) {
    toast.error("দুঃখিত, আপনি এই কাজটি করার জন্য অনুমতি প্রাপ্ত নন।");
  }

  return Promise.reject(error);
};
api.interceptors.response.use(onResponseSuccess);

export default api;
