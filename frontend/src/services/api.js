
import axios from "axios";


const api = axios.create({

    baseURL: "http://127.0.0.1:8000/api/",

    headers: {
        "Content-Type": "application/json"
    }
});




api.interceptors.request.use((config) => {

    const access = localStorage.getItem("access");

    if (access) {
        config.headers.Authorization = `Bearer ${access}`;
    }

    return config;
});




api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("login/") &&
            !originalRequest.url.includes("token/refresh/")
        ) {

            originalRequest._retry = true;

            const refresh = localStorage.getItem("refresh");

            if (!refresh) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                return Promise.reject(error);
            }

            try {

                const response = await axios.post(
                    "http://127.0.0.1:8000/api/token/refresh/",
                    { refresh }
                );

                const newAccess = response.data.access;

                localStorage.setItem("access", newAccess);

                originalRequest.headers.Authorization =
                    `Bearer ${newAccess}`;

                return api(originalRequest);

            } catch (refreshError) {

                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
