import axios, { AxiosError } from "axios";
import { backendApi } from "@/config";
import { ToastDataType } from "../CustomToastContext";

const ERROR_CODE = {
  permissionError: "1001",
  forbiddenError: "1002",
};

Object.freeze(ERROR_CODE);

export interface errorInterface extends ToastDataType {
  data: any;
}

// export type Ok<T> = { _tag: "Ok"; ok: T };
// export type Err<E> = { _tag: "Err"; err: E };
// export type Result<T, E> = Ok<T> | Err<E>;
// export const Result = Object.freeze({
//   Ok: <T, E>(ok: T): Result<T, E> => ({ _tag: "Ok", ok }),
//   Err: <T, E>(err: E): Result<T, E> => ({ _tag: "Err", err }),
// });

export const axiosInstance = (
  history: any = null,
  passedHeaders: any = null
) => {
  let headers: any = passedHeaders ? passedHeaders : {};

  const axiosInstance = axios.create({
    baseURL: backendApi,
    headers,
  });

  function clearTokenAndRedirectToHome() {
    if (history) {
      history.push("/");
      history.push("/login");
    }
  }

  axiosInstance.interceptors.request.use(
    (request) => {
      if (navigator) {
        //@ts-ignore
        let bandwidth = navigator["connection"]?.downlink; //in mb/s
        let maxSlowSpeed = 400; // in kb/s
        if (bandwidth * 1000 <= maxSlowSpeed) {
          if (localStorage.getItem("slowInternetConnection") !== "true") {
            localStorage.setItem("slowInternetConnection", "true");
          }
        } else if (localStorage.getItem("slowInternetConnection") === "true") {
          localStorage.setItem("slowInternetConnection", "false");
        }
      }
      return request;
    },
    (error: errorInterface) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) =>
      new Promise((resolve, reject) => {
        resolve(response);
      }),
    (error) => {
      if (!navigator.onLine) {
        new Promise((resolve, reject) => {
          resolve({
            data: {},
            status: 200,
            message: "Api call stopped on offline mode",
          });
        });
      }

      if (
        error.request.responseType === "blob" &&
        error.response.data.type.toLowerCase().indexOf("json") !== -1
      ) {
        return new Promise(async (resolve, reject) => {
          const bufferArray = await error.response.data.text();
          const err = JSON.parse(bufferArray);
          reject({ open: true, type: "error", message: err.error });
        });
      }
      if (error.request.responseType === "arraybuffer") {
        const enc = new TextDecoder("utf-8");
        const data = enc.decode(error.response.data);
        const err = JSON.parse(data);
        return new Promise((resolve, reject) =>
          reject({ open: true, type: "error", message: err.error })
        );
      }

      if (!error.response) {
        return new Promise((resolve, reject) => {
          reject({
            open: true,
            type: "error",
            message: error.response.data.error,
          });
        });
      }

      if (
        error.response.data &&
        error.response.data.code &&
        Object.values(ERROR_CODE).some((s) => s === error.response.data.code)
      ) {
        if (
          window.confirm(
            `${error.response.data.error}\n\nPress Ok to redirect to home\nPress Cancel to stay here`
          )
        ) {
          localStorage.removeItem("selectedEntity");
          //@ts-ignore
          window.location = "/";
        }
      } else if (error.response.status === 511) {
        localStorage.clear();
        //@ts-ignore
        window.location = "/";
      } else if (
        error?.response?.data &&
        error?.response?.data?.code &&
        error?.response?.data?.code === "1005"
      ) {
        return new Promise((resolve, reject) => {
          reject({
            open: true,
            type: "error",
            message: error.response.data.error || error.response.data.message,
          });
        });
      } else {
        if (error.response.status === 401) {
          clearTokenAndRedirectToHome();
          return new Promise((resolve, reject) => {
            reject({
              open: true,
              type: "error",
              message: error.response.data.error || error.response.data.message,
            });
          });
        } else if (error.response.status === 511) {
          clearTokenAndRedirectToHome();
        } else {
          return new Promise((resolve, reject) => {
            reject({
              open: true,
              type: "error",
              message: error.response.data.error || error.response.data.message,
              data: error.response.data,
            });
          });
        }
      }
    }
  );

  return axiosInstance;
};
