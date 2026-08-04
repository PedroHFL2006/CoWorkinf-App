import { prisma } from "../config/prisma.js";
import { normalizarData } from "../utils/dateUtils.js";

export async function buscarTodasSalas(filtros) {
    const { dia, turno } = filtros || {};

    // Se informou dia e turno, filtra as salas que NÃO têm reserva para esse momento
    if (dia && turno) {
        const diaNormalizado = normalizarData(dia);
        return await prisma.sala.findMany({
            where: {
                reservas: {
                    none: {
                        dia: diaNormalizado,
                        turno: turno
                    }
                }
            }
        });
    }

    // Comportamento padrão: retorna todas as salas
    return await prisma.sala.findMany();
}

export async function buscarSalaPorId(id) {
    return await prisma.sala.findUnique({
        where: { id: Number(id) }
    });
}

export async function criarSala(dados) {
    return await prisma.sala.create({
        data: dados
    });
}

export async function atualizarSala(id, dados) {
    return await prisma.sala.update({
        where: { id: Number(id) },
        data: dados
    });
}

export async function deletarSala(id) {
    return await prisma.sala.delete({
        where: { id: Number(id) }
    });
}