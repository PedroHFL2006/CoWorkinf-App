import {
    buscarTodasReservas,
    buscarReservaPorId,
    criarReserva,
    atualizarReserva,
    deletarReserva
} from "../services/reservaService.js";

export async function listarReservas(req, res) {
    try {
        // Usuário comum só vê as próprias reservas; admin vê todas
        const filtro = req.usuarioAdmin ? {} : { idUsuario: req.usuarioId };
        const reservas = await buscarTodasReservas(filtro);
        return res.json(reservas);
    } catch (error) {
        console.error("[listarReservas]", error);
        return res.status(500).json({ error: "Erro ao Buscar Reservas", detalhe: error.message });
    }
}

export async function buscarReserva(req, res) {
    try {
        const reserva = await buscarReservaPorId(req.params.id);
        if (!reserva) {
            return res.status(404).json({ error: "Reserva Não Encontrada" });
        }

        // Usuário comum só pode ver a própria reserva
        if (!req.usuarioAdmin && reserva.idUsuario !== req.usuarioId) {
            return res.status(403).json({ error: "Acesso negado a essa reserva." });
        }

        return res.json(reserva);
    } catch (error) {
        console.error("[buscarReserva]", error);
        return res.status(500).json({ error: "Erro ao Buscar Reserva", detalhe: error.message });
    }
}

export async function cadastrarReserva(req, res) {
    try {
        const reserva = await criarReserva(req.body);
        return res.status(201).json(reserva);
    } catch (error) {
        console.error("[cadastrarReserva]", error);
        return res.status(400).json({ error: error.message, detalhe: error.toString() });
    }
}

export async function editarReserva(req, res) {
    try {
        const reserva = await atualizarReserva(req.params.id, req.body);
        return res.json(reserva);
    } catch (error) {
        console.error("[editarReserva]", error);
        return res.status(400).json({ error: error.message, detalhe: error.toString() });
    }
}

export async function removerReserva(req, res) {
    try {
        await deletarReserva(req.params.id);
        return res.status(204).send();
    } catch (error) {
        console.error("[removerReserva]", error);
        return res.status(400).json({ error: error.message });
    }
}