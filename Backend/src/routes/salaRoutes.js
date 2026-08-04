import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";
import { salaSchema } from "../schemas/salaSchema.js";
import { listarSalas, buscarSala, cadastrarSala, editarSala, removerSala } from "../controllers/salaController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Salas
 *   description: Gerenciamento de salas de co-working
 */

/**
 * @swagger
 * /salas:
 *   get:
 *     summary: Lista todas as salas (usuários autenticados)
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salas retornada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get("/", authMiddleware, listarSalas);

/**
 * @swagger
 * /salas/{id}:
 *   get:
 *     summary: Busca uma sala pelo ID (usuários autenticados)
 *     tags: [Salas]
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
 *         description: Sala encontrada
 *       404:
 *         description: Sala não encontrada
 */
router.get("/:id", authMiddleware, buscarSala);

/**
 * @swagger
 * /salas:
 *   post:
 *     summary: Cadastra uma nova sala (somente admin)
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalaInput'
 *     responses:
 *       201:
 *         description: Sala criada com sucesso
 *       403:
 *         description: Acesso restrito a administradores
 */
router.post("/", authMiddleware, adminMiddleware, validate(salaSchema), cadastrarSala);

/**
 * @swagger
 * /salas/{id}:
 *   put:
 *     summary: Edita uma sala existente (somente admin)
 *     tags: [Salas]
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
 *         description: Sala atualizada com sucesso
 *       403:
 *         description: Acesso restrito a administradores
 */
router.put("/:id", authMiddleware, adminMiddleware, validate(salaSchema), editarSala);

/**
 * @swagger
 * /salas/{id}:
 *   delete:
 *     summary: Remove uma sala (somente admin)
 *     tags: [Salas]
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
 *         description: Sala removida com sucesso
 *       403:
 *         description: Acesso restrito a administradores
 */
router.delete("/:id", authMiddleware, adminMiddleware, removerSala);

/**
 * @swagger
 * components:
 *   schemas:
 *     SalaInput:
 *       type: object
 *       required:
 *         - nome
 *         - capacidade
 *         - precoLocacao
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 2
 *           example: "Sala Alpha"
 *         capacidade:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         descricao:
 *           type: string
 *           example: "Sala com projetor e ar-condicionado"
 *         precoLocacao:
 *           type: number
 *           minimum: 0.01
 *           example: 150.00
 *     Sala:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: "Sala Alpha"
 *         capacidade:
 *           type: integer
 *           example: 10
 *         descricao:
 *           type: string
 *           example: "Sala com projetor e ar-condicionado"
 *         precoLocacao:
 *           type: number
 *           example: 150.00
 *         dtCriacao:
 *           type: string
 *           format: date-time
 *     ErroValidacao:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Erro de Validação"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               campo:
 *                 type: string
 *                 example: "nome"
 *               mensagem:
 *                 type: string
 *                 example: "O Nome Deve Ter no Mínimo 2 Caracteres"
 */

export default router;