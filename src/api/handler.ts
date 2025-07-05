import {ApiMap} from "@/api/type";
import store from "@/store";

export function useApi<K extends keyof ApiMap> (apiConfig: {
    api: Promise<{ data: ApiMap[K]['resp'], code: number, message: string}>
    onSuccess?: (callback: {data: ApiMap[K]['resp'], code: number, message: string }) => void
    onFail?: (callback: { data: ApiMap[K]['resp'], code: number, message: string }) => void
    Finally?: (callback: { data: ApiMap[K]['resp'], code: number, message: string }) => void
    tip?: string
}) {
    apiConfig.api.then(resp => {
        console.log(resp)
        if (resp.code !== 200) {
            if (apiConfig.onFail) apiConfig.onFail(resp)
            else store.dispatch('snackBarModule/showError', resp.message).then();
            if (apiConfig.Finally) apiConfig.Finally(resp)
            return
        } else {
            if (apiConfig.onSuccess) apiConfig.onSuccess(resp)
            if (apiConfig.tip) store.dispatch('snackBarModule/showSuccess', apiConfig.tip).then();
            if (apiConfig.Finally) apiConfig.Finally(resp)
            return
        }
    })
    return
}
