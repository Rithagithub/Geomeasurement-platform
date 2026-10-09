import axiosInstance from "@/lib/axios";

const api = {

    get: async (url: string, config = {}) => {
        return axiosInstance.get(url, config);
    },

    post: async (
        url: string,
        data: any = {},
        config = {}
    ) => {
        return axiosInstance.post(url, data, config);
    },

    put: async (
        url: string,
        data: any = {},
        config = {}
    ) => {
        return axiosInstance.put(url, data, config);
    },

    delete: async (
        url: string,
        config = {}
    ) => {
        return axiosInstance.delete(url, config);
    }

};

export default api;