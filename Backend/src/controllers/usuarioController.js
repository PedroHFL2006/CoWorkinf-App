import {
    buscarTodosUsuarios,
    buscarUsuarioPorId,
    salvarUsuario,
    atualizarUsuario,
    deletarUsuario,
} from "../services/usuarioService.js";

export async function listarUsuarios(req, res) {
    try {
        const usuarios = await buscarTodosUsuarios();
        return res.json(usuarios);
    } catch (error) {
        console.error("[listarUsuarios]", error);
        return res.status(500).json({ error: "Erro ao buscar usuários" });
    }
}

export async function buscarUsuario(req, res) {
    try {
        const usuario = await buscarUsuarioPorId(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário Não Encontrado" });
        }
        return res.json(usuario);
    } catch (error) {
        console.error("[buscarUsuario]", error);
        return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
}

export async function criarUsuario(req, res) {
    try {
        const novoUsuario = await salvarUsuario(req.body);
        return res.status(201).json(novoUsuario);
    } catch (error) {
        console.error("[criarUsuario]", error);
        return res.status(400).json({ error: error.message });
    }
}

export async function editarUsuario(req, res) {
    try {
        const usuario = await atualizarUsuario(req.params.id, req.body);
        return res.json(usuario);
    } catch (error) {
        console.error("[editarUsuario]", error);
        return res.status(400).json({ error: error.message });
    }
}

export async function removerUsuario(req, res) {
    try {
        await deletarUsuario(req.params.id);
        return res.status(204).send();
    } catch (error) {
        console.error("[removerUsuario]", error);
        return res.status(400).json({ error: error.message });
    }
}