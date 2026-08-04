import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string({ required_error: "O E-mail é Obrigatório" })
        .email("Informe um E-mail Válido"),

    senha: z
        .string({ required_error: "A Senha é Obrigatória" })
        .min(1, "A Senha é Obrigatória"),
});