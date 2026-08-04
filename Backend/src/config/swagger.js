import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CoWorking App API",
            version: "1.0.0",
            description: "API para gestão de reservas de salas de co-working"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor de Desenvolvimento"
            }
        ]
    },
    apis: ["./src/routes/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);
