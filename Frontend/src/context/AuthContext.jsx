import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "coworking_token";
const USUARIO_KEY = "coworking_usuario";

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [usuario, setUsuario] = useState(() => {
        const raw = localStorage.getItem(USUARIO_KEY);
        return raw ? JSON.parse(raw) : null;
    });

    const login = useCallback(async (email, senha) => {
        const response = await api.post("/auth/login", { email, senha });
        const { token: novoToken, usuario: novoUsuario } = response.data;

        localStorage.setItem(TOKEN_KEY, novoToken);
        localStorage.setItem(USUARIO_KEY, JSON.stringify(novoUsuario));

        setToken(novoToken);
        setUsuario(novoUsuario);

        return novoUsuario;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USUARIO_KEY);
        setToken(null);
        setUsuario(null);
    }, []);

    const value = {
        token,
        usuario,
        isAuthenticated: !!token,
        isAdmin: !!usuario?.admin,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
    }
    return context;
}