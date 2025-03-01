import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // FastAPI backend

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Ensures authentication cookies are sent
});

export const fetchHomeData = async () => {
    try {
        const response = await api.get("/");
        return response.data;
    } catch (error) {
        console.error("Error fetching home data:", error);
        return null;
    }
};

export default api;
