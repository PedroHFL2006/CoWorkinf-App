import express from "express";
import "dotenv/config";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./config/swagger.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Roteador central (agrupa /auth, /usuarios, /salas, /reservas)
app.use(routes);

app.listen(PORT, () => {
    console.log(`A API Subiu na porta ${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});