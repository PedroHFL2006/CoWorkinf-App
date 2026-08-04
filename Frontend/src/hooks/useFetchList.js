import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

/**
 * Hook genérico para buscar uma lista de um endpoint da API.
 * Centraliza os estados de loading/erro/data que se repetiam
 * em ListaUsuarios, ListaSalas e ListaReservas.
 */
export function useFetchList(endpoint) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const carregar = useCallback(async () => {
        setLoading(true);
        setErro(null);
        try {
            const response = await api.get(endpoint);
            setData(response.data);
        } catch (error) {
            console.error(`Erro ao buscar ${endpoint}:`, error);
            setErro("Não foi possível carregar a lista.");
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        carregar();
    }, [carregar]);

    return { data, loading, erro, recarregar: carregar };
}