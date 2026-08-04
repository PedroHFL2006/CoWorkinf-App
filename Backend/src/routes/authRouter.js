import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { loginSchema } from "../schemas/authSchema.js";
import { login } from "../controllers/authController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Login e emissão de token JWT
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: "pedro@email.com"
 *               senha:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: E-mail ou senha inválidos
 *       400:
 *         description: Erro de validação
 */
router.post("/login", validate(loginSchema), login);

export default router;