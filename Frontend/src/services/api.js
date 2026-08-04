import axios from "axios";

const TOKEN_KEY = "coworking_token";
const USUARIO_KEY = "coworking_usuario";

// Instância base do Axios apontando para a nossa API (Backend)
export const api = axios.create({
    baseURL: "http://localhost:3000",
});

// Anexa o token JWT em toda requisição, se existir
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Se o token expirar/for inválido, limpa a sessão e manda pro login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USUARIO_KEY);
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);