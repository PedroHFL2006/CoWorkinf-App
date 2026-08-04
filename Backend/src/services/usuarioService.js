import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";

const SALT_ROUNDS = 10;

const SELECT_SEM_SENHA = {
    id: true,
    nome: true,
    email: true,
    telefone: true,
    cpf: true,
    admin: true,
    dtCriacao: true,
    dtAtualizacao: true,
};

export async function buscarTodosUsuarios() {
    // select explícito para nunca vazar o hash da senha
    return await prisma.usuario.findMany({
        select: SELECT_SEM_SENHA,
    });
}

export async function buscarUsuarioPorId(id) {
    return await prisma.usuario.findUnique({
        where: { id: Number(id) },
        select: SELECT_SEM_SENHA,
    });
}

export async function salvarUsuario(dados) {
    const senhaHash = await bcrypt.hash(dados.senha, SALT_ROUNDS);

    const usuarioCriado = await prisma.usuario.create({
        data: {
            ...dados,
            senha: senhaHash,
        },
    });

    const { senha, ...usuarioSemSenha } = usuarioCriado;
    return usuarioSemSenha;
}

export async function atualizarUsuario(id, dados) {
    const dataToUpdate = { ...dados };

    // Só re-hasheia se uma nova senha foi enviada; se não, mantém a atual
    if (dataToUpdate.senha) {
        dataToUpdate.senha = await bcrypt.hash(dataToUpdate.senha, SALT_ROUNDS);
    } else {
        delete dataToUpdate.senha;
    }

    const usuarioAtualizado = await prisma.usuario.update({
        where: { id: Number(id) },
        data: dataToUpdate,
    });

    const { senha, ...usuarioSemSenha } = usuarioAtualizado;
    return usuarioSemSenha;
}

export async function deletarUsuario(id) {
    return await prisma.usuario.delete({
        where: { id: Number(id) },
    });
}