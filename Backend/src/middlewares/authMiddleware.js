import jwt from "jsonwebtoken";

/**
 * Exige um token JWT válido no header Authorization (Bearer <token>).
 * Em caso de sucesso, disponibiliza req.usuarioId e req.usuarioAdmin.
 */
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido." });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;

    try {
        const payload = jwt.verify(token, jwtSecret);
        req.usuarioId = payload.id;
        req.usuarioAdmin = payload.admin;
        return next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
}

/**
 * Deve ser usado APÓS o authMiddleware.
 * Bloqueia o acesso caso o usuário autenticado não seja admin.
 */
export function adminMiddleware(req, res, next) {
    if (!req.usuarioAdmin) {
        return res.status(403).json({ error: "Acesso restrito a administradores." });
    }
    return next();
}

/**
 * Deve ser usado APÓS o authMiddleware, e ANTES do validate(reservaSchema).
 * Usuários comuns só podem criar reservas para si mesmos: o idUsuario
 * enviado no body é ignorado e substituído pelo id do token.
 * Admins podem, opcionalmente, informar um idUsuario diferente no body
 * (ex: criar uma reserva em nome de outra pessoa).
 */
export function forcarIdUsuario(req, res, next) {
    if (!req.usuarioAdmin || !req.body.idUsuario) {
        req.body.idUsuario = req.usuarioId;
    }
    return next();
}