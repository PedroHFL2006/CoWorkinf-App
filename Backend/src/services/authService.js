import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

const JWT_EXPIRES_IN = "8h";

export async function autenticar({ email, senha }) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET não configurado no servidor.");
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    // Mensagem genérica de propósito: não revelar se o e-mail existe ou não
    if (!usuario) {
        throw new Error("E-mail ou senha inválidos.");
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
        throw new Error("E-mail ou senha inválidos.");
    }

    const token = jwt.sign(
        { id: usuario.id, admin: usuario.admin },
        jwtSecret,
        { expiresIn: JWT_EXPIRES_IN }
    );

    const { senha: _senha, ...usuarioSemSenha } = usuario;

    return { token, usuario: usuarioSemSenha };
}