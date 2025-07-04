import {ApiMap} from "@/api/type";
import axios, {AxiosRequestConfig} from "axios";
import {user} from "@/api/index";
import store from "@/store";

const BaseURL = 'http://110.41.32.16:8080'

export async function request<K extends keyof ApiMap>(
requestConfig: {
    url: K,
    method: "GET" | "POST" | "PUT" | "DELETE",
    pathParam?:  ApiMap[K]['req'],
    data?: ApiMap[K]['req']
    withToken?: boolean
}): Promise<{
    data: ApiMap[K]['resp']
    code: number
    message: string
}> {
    const finalUrl = replacePathParams(requestConfig.url, requestConfig.pathParam as any);

    const config: AxiosRequestConfig = {
        url: BaseURL + finalUrl,
        method: requestConfig.method,
        headers: {}
    };

    if (requestConfig.withToken) {
        const userInfo = user.GetUserInfo()
        if (userInfo && config.headers) {
            config.headers['Authorization'] = userInfo.token
        } else {
            store.dispatch('snackBarModule/showError', '请先登录').then()
        }
    }

    if (requestConfig.method === 'GET') {
        config.params = requestConfig.data;
    } else {
        config.data = requestConfig.data;
    }

    return axios(config).then(res => res.data);
}

function replacePathParams(url: string, pathParam: Record<string, any> = {}): string {
    return url.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
        if (key in pathParam) {
            return encodeURIComponent(pathParam[key]);
        } else {
            throw new Error(`Missing path parameter: ${key}`);
        }
    });
}
