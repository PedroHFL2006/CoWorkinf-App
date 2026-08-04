import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";
import { usuarioSchema, usuarioUpdateSchema } from "../schemas/usuarioSchema.js";
import {
    listarUsuarios,
    buscarUsuario,
    criarUsuario,
    editarUsuario,
    removerUsuario,
} from "../controllers/usuarioController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários (somente admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 */
router.get("/", authMiddleware, adminMiddleware, listarUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID (somente admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/:id", authMiddleware, adminMiddleware, buscarUsuario);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário (cadastro público)
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *           example:
 *             nome: "Pedro Silva"
 *             email: "pedro@email.com"
 *             senha: "senha123"
 *             telefone: "11999999999"
 *             cpf: "12345678900"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post("/", validate(usuarioSchema), criarUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Edita um usuário existente (somente admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.put("/:id", authMiddleware, adminMiddleware, validate(usuarioUpdateSchema), editarUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Remove um usuário (somente admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso
 */
router.delete("/:id", authMiddleware, adminMiddleware, removerUsuario);

/**
 * @swagger
 * components:
 *   schemas:
 *     UsuarioInput:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *         - telefone
 *         - cpf
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 2
 *           example: "Pedro Silva"
 *         email:
 *           type: string
 *           format: email
 *           example: "pedro@email.com"
 *         senha:
 *           type: string
 *           minLength: 6
 *           example: "senha123"
 *         telefone:
 *           type: string
 *           minLength: 10
 *           example: "11999999999"
 *         cpf:
 *           type: string
 *           pattern: '^\d{11}$'
 *           example: "12345678900"
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: "Pedro Silva"
 *         email:
 *           type: string
 *           example: "pedro@email.com"
 *         telefone:
 *           type: string
 *           example: "11999999999"
 *         cpf:
 *           type: string
 *           example: "12345678900"
 *         admin:
 *           type: boolean
 *           example: false
 *         dtCriacao:
 *           type: string
 *           format: date-time
 */

export default router;