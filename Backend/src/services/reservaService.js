import { prisma } from "../config/prisma.js";
import { normalizarData } from "../utils/dateUtils.js";

export async function buscarTodasReservas(filtro = {}) {
    const { idUsuario } = filtro;

    return await prisma.reserva.findMany({
        where: idUsuario ? { idUsuario: Number(idUsuario) } : undefined,
        include: {
            usuario: { select: { id: true, nome: true, email: true } },
            sala: { select: { id: true, nome: true } }
        }
    });
}

export async function buscarReservaPorId(id) {
    return await prisma.reserva.findUnique({
        where: { id: Number(id) },
        include: {
            usuario: { select: { id: true, nome: true, email: true } },
            sala: { select: { id: true, nome: true } }
        }
    });
}

export async function criarReserva(dados) {
    const diaNormalizado = normalizarData(dados.dia);

    // 1. Verificar se Usuário existe
    const usuarioExists = await prisma.usuario.findUnique({ where: { id: dados.idUsuario } });
    if (!usuarioExists) {
        throw new Error("Usuário não encontrado.");
    }

    // 2. Verificar se Sala existe
    const salaExists = await prisma.sala.findUnique({ where: { id: dados.idSala } });
    if (!salaExists) {
        throw new Error("Sala não encontrada.");
    }

    // 3. Verificar conflito de horário (mesma sala, dia e turno)
    const conflito = await prisma.reserva.findFirst({
        where: {
            idSala: dados.idSala,
            dia: diaNormalizado,
            turno: dados.turno
        }
    });

    if (conflito) {
        throw new Error("Sala já reservada para este dia e turno.");
    }

    return await prisma.reserva.create({
        data: {
            dia: diaNormalizado,
            turno: dados.turno,
            idUsuario: dados.idUsuario,
            idSala: dados.idSala
        }
    });
}

export async function atualizarReserva(id, dados) {
    const diaNormalizado = dados.dia ? normalizarData(dados.dia) : undefined;

    // Se estiver mudando dia, turno ou sala, precisamos checar conflito novamente
    if (diaNormalizado || dados.turno || dados.idSala) {
        const reservaAtual = await buscarReservaPorId(id);
        if (!reservaAtual) throw new Error("Reserva não encontrada.");

        const idSalaVerificar = dados.idSala || reservaAtual.idSala;
        const diaVerificar = diaNormalizado || reservaAtual.dia;
        const turnoVerificar = dados.turno || reservaAtual.turno;

        const conflito = await prisma.reserva.findFirst({
            where: {
                id: { not: Number(id) }, // ignorar a própria reserva
                idSala: idSalaVerificar,
                dia: diaVerificar,
                turno: turnoVerificar
            }
        });

        if (conflito) {
            throw new Error("Sala já reservada para este dia e turno.");
        }
    }

    return await prisma.reserva.update({
        where: { id: Number(id) },
        data: {
            dia: diaNormalizado,
            turno: dados.turno,
            idUsuario: dados.idUsuario,
            idSala: dados.idSala
        }
    });
}

export async function deletarReserva(id) {
    return await prisma.reserva.delete({
        where: { id: Number(id) }
    });
}