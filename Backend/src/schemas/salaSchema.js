import { z } from "zod";

export const salaSchema = z.object({
    nome: z
        .string({ required_error: "O Nome da Sala é Obrigatório" })
        .min(2, "O Nome Deve Ter no Mínimo 2 Caracteres"),

    capacidade: z
        .number({ required_error: "A Capacidade é Obrigatória" })
        .int("A Capacidade Deve Ser um Número Inteiro")
        .positive("A Capacidade Deve Ser um Número Maior Que Zero"),

    descricao: z.string().optional(),

    precoLocacao: z
        .number({ required_error: "O Preço de Locação é Obrigatório" })
        .positive("O Preço de Locação Deve Ser Um Valor Positivo")
})