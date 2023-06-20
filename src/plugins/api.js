import axios from "axios"
import { useAppStore } from '@/store/app'

const { VITE_API_SERVER: API_SERVER, MODE } = import.meta.env

const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        "x-application": "not-ary"
    }
})

const apiService = (app) => {
    const { $auth0 } = app.config.globalProperties
    const store = useAppStore()

    const request = async (passedOptions) => {
        const defaultOptions = {
            method: 'GET',
            params: {
                sessionId: store.sessionId
            }
        }
        const options = {
            ...defaultOptions,
            ...passedOptions
        }

        try {
            return await axiosInstance(options)
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data)
                console.log(error.response.status)
                console.log(error.response.headers)
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request)
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message)
            }
            console.log(error.config)
        }
    }

    return {
        sync: async (syncStateObj = {}) => {
            const token = await $auth0.getAccessTokenSilently();

            Object.values(syncStateObj).map(async state => {
                const response = await request({
                    url: `${API_SERVER}/v1/user/sync/`,
                    method: "PUT",
                    data: {
                        state
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (/200/.test(response.status)) {
                    if (MODE === 'production') {
                        store.syncStateObj = syncStateObj
                    }
                    return response
                }
                return response.status
            })
        },
        request,
        buildInfo: async () => {
            if (MODE !== 'production') {
                return
            }
            try {
                const { data } = await axiosInstance.get(`${window.origin}/build-info.json`, {
                    headers: {
                        'Cache-Control': 'no-store, max-age=0',
                    },
                })
                return data
            } catch (error) {
                console.error(error)
            }
        }
    }
}

export default {
    async install(app, options = { $auth: {} }) {
        const { $auth } = options
        app.config.globalProperties.$api = apiService(app, $auth)
    }
}