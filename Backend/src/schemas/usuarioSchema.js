import { z } from "zod";

export const usuarioSchema = z.object({
    nome: z
        .string({ required_error: "O Nome é Obrigatório" })
        .min(2, "O Nome Deve Ter no Mínimo 2 Caracteres"),

    email: z
        .string({ required_error: "O E-mail é Obrigatório" })
        .email("Informe um E-mail Válido"),

    senha: z
        .string({ required_error: "A Senha é Obrigatória" })
        .min(6, "A Senha Deve Ter no Mínimo 6 Caracteres"),

    telefone: z
        .string({ required_error: "O Telefone é Obrigatório" })
        .min(10, "O Telefone Deve Ter no Mínimo 10 Dígitos"),

    cpf: z
        .string({ required_error: "O CPF é Obrigatório" })
        .length(11, "O CPF Deve Ter Exatamente 11 Dígitos")
        .regex(/^\d{11}$/, "O CPF Deve Conter Apenas Números")
});

// Usado em PUT /usuarios/:id — todos os campos são opcionais,
// já que o admin pode querer atualizar só um campo por vez.
export const usuarioUpdateSchema = usuarioSchema.partial();