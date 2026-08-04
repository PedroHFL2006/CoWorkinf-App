import { Router } from "express";

import authRouter from "./authRouter.js";
import usuarioRoutes from "./usuarioRoutes.js";
import salaRoutes from "./salaRoutes.js";
import reservaRouter from "./reservaRouter.js";

/**
 * ROTEADOR CENTRAL (Index Router)
 *
 * O que é?
 * É o arquivo central que agrupa e organiza todas as rotas da nossa aplicação.
 * Em vez de registrar dezenas de rotas diretamente no `server.js`, nós agrupamos as rotas
 * em pequenos arquivos separados (módulos) e depois as acoplamos aqui neste roteador central.
 */

const router = Router();

router.use("/auth", authRouter);
router.use("/usuarios", usuarioRoutes);
router.use("/salas", salaRoutes);
router.use("/reservas", reservaRouter);

export default router;