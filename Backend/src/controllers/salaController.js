import { buscarTodasSalas, buscarSalaPorId, criarSala, atualizarSala, deletarSala } from "../services/salaService.js";

export async function listarSalas(req, res) {
    try {
        const { dia, turno } = req.query;
        const salas = await buscarTodasSalas({ dia, turno });
        return res.json(salas);
    } catch (error) {
        console.error("[listarSalas]", error);
        return res.status(500).json({ error: "Erro ao Buscar Sala", detalhe: error.message });
    }
}

export async function buscarSala(req, res) {
    try {
        const sala = await buscarSalaPorId(req.params.id);
        if (!sala) {
            return res.status(404).json({ error: "Sala Não Encontrada" });
        }
        return res.json(sala);
    } catch (error) {
        console.error("[buscarSala]", error);
        return res.status(500).json({ error: "Erro ao Buscar Sala", detalhe: error.message });
    }
}

export async function cadastrarSala(req, res) {
    try {
        const sala = await criarSala(req.body);
        return res.status(201).json(sala);
    } catch (error) {
        console.error("[cadastrarSala]", error);
        return res.status(400).json({ error: error.message, detalhe: error.toString() });
    }
}

export async function editarSala(req, res) {
    try {
        const sala = await atualizarSala(req.params.id, req.body);
        return res.json(sala);
    } catch (error) {
        console.error("[editarSala]", error);
        return res.status(400).json({ error: error.message, detalhe: error.toString() });
    }
}

export async function removerSala(req, res) {
    try {
        await deletarSala(req.params.id);
        return res.status(204).send();
    } catch (error) {
        console.error("[removerSala]", error);
        return res.status(400).json({ error: error.message });
    }
}