import axios from "axios";

const AUTH_BASE_URL = import.meta.env.VITE_LOCAL_AUTH_BASE_URL;
// const API_BASE_URL = import.meta.env.VITE_LOCAL_API_ACTIVITY_BASE_URL;

const auth_api = axios.create({
    baseURL: AUTH_BASE_URL,
    headers: {
        "Content-type": "application/json"
    }
});

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         "Content-type": "application/json"
//     }
// });

const registerUser = async (userData: any) => {
    try {
        const response = await auth_api.post("/register", userData);
        return response.data;
    } catch (error : any) {
        throw new Error(error.response?.data?.message || "Error in registering user");
    }
};

const loginUser = async (userData: any) => {
    try {
        const response = await auth_api.post("/login", userData);
        return response.data;
    } catch (error : any) {
        throw new Error(error.response?.data?.message || "Error in logging in user");
    }
};


export { registerUser, loginUser };