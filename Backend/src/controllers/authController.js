import { autenticar } from "../services/authService.js";

export async function login(req, res) {
    try {
        const resultado = await autenticar(req.body);
        return res.json(resultado);
    } catch (error) {
        console.error("[login]", error);
        return res.status(401).json({ error: error.message });
    }
}