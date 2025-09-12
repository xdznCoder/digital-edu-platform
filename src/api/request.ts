import { ApiMap } from "@/api/type";
import axios, { AxiosRequestConfig } from "axios";
import { user } from "@/api/index";
import store from "@/store";

export const BaseURL = "http://118.24.186.26:8080";

export async function request<K extends keyof ApiMap>(requestConfig: {
  url: K;
  method: "GET" | "POST" | "PUT" | "DELETE";
  pathParam?: ApiMap[K]["req"];
  data?: ApiMap[K]["req"] | FormData;
  withToken?: boolean;
  withFormData?: boolean;
}): Promise<{
  data: ApiMap[K]["resp"];
  code: number;
  message: string;
}> {
  const finalUrl = replacePathParams(
    requestConfig.url,
    requestConfig.pathParam as any
  );

  const config: AxiosRequestConfig = {
    url: BaseURL + finalUrl,
    method: requestConfig.method,
    headers: {},
  };

  if (requestConfig.withToken) {
    const userInfo = user.GetUserInfo();
    if (userInfo && config.headers) {
      config.headers["Authorization"] = userInfo.token;
    } else {
      store.dispatch("snackBarModule/showError", "请先登录").then();
    }
  }

  let requestData: any = requestConfig.data;
  if (
    requestConfig.withFormData &&
    requestData &&
    typeof requestData === "object" &&
    !(requestData instanceof FormData)
  ) {
    const formData = new FormData();
    for (const key in requestData) {
      const value = requestData[key];
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, value as any);
      }
    }
    requestData = formData;
  }

  if (requestConfig.method === "GET") {
    config.params = requestData;
  } else {
    config.data = requestData;
  }

  return axios(config).then((res) => res.data);
}

function replacePathParams(
  url: string,
  pathParam: Record<string, any> = {}
): string {
  return url.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    if (key in pathParam) {
      return encodeURIComponent(pathParam[key]);
    } else {
      throw new Error(`Missing path parameter: ${key}`);
    }
  });
}
