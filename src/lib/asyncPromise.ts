import type { AxiosPromise, AxiosResponse, AxiosError } from "axios";
import type { errorInterface } from "./axios";

export async function asyncPromise(
  promise: Promise<AxiosPromise>
): Promise<[AxiosResponse<any, any> | null, errorInterface | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    const e = error as errorInterface;
    return [null, e];
  }
}
