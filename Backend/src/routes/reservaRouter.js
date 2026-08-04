import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { authMiddleware, adminMiddleware, forcarIdUsuario } from "../middlewares/authMiddleware.js";
import { reservaSchema } from "../schemas/reservaSchema.js";
import {
    listarReservas,
    buscarReserva,
    cadastrarReserva,
    editarReserva,
    removerReserva
} from "../controllers/reservaController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Gerenciamento de reservas de salas
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Lista reservas (usuário comum vê só as próprias; admin vê todas)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas retornada com sucesso
 */
router.get("/", authMiddleware, listarReservas);

/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Busca uma reserva pelo ID (dono da reserva ou admin)
 *     tags: [Reservas]
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
 *         description: Reserva encontrada
 *       403:
 *         description: Acesso negado a essa reserva
 *       404:
 *         description: Reserva não encontrada
 */
router.get("/:id", authMiddleware, buscarReserva);

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Cria uma nova reserva para o usuário autenticado
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dia
 *               - turno
 *             properties:
 *               dia:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-15"
 *               turno:
 *                 type: string
 *                 enum: ["Manhã", "Tarde", "Noite"]
 *               idSala:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post("/", authMiddleware, forcarIdUsuario, validate(reservaSchema), cadastrarReserva);

/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Edita uma reserva existente (somente admin)
 *     tags: [Reservas]
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
 *         description: Reserva atualizada com sucesso
 *       403:
 *         description: Acesso restrito a administradores
 */
router.put("/:id", authMiddleware, adminMiddleware, validate(reservaSchema), editarReserva);

/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Remove uma reserva (somente admin)
 *     tags: [Reservas]
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
 *         description: Reserva removida com sucesso
 *       403:
 *         description: Acesso restrito a administradores
 */
router.delete("/:id", authMiddleware, adminMiddleware, removerReserva);

/**
 * @swagger
 * components:
 *   schemas:
 *     Reserva:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         dia:
 *           type: string
 *           format: date-time
 *         turno:
 *           type: string
 *           example: "Manhã"
 *         idUsuario:
 *           type: integer
 *           example: 1
 *         idSala:
 *           type: integer
 *           example: 1
 *         usuario:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             nome:
 *               type: string
 *             email:
 *               type: string
 *         sala:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             nome:
 *               type: string
 *         dtCriacao:
 *           type: string
 *           format: date-time
 */

export default router;