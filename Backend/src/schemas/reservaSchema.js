import { z } from "zod";

export const reservaSchema = z.object({
    dia: z.string({ required_error: "A Data de Reserva é Obrigatória" }),

    turno: z.enum(["Manhã", "Tarde", "Noite"], {
        errorMap: () => ({ message: "O Turno Deve Ser 'Manhã', 'tarde' ou 'noite'" })
    }),

    idUsuario: z.number().int().positive("ID do Usuário Inválido"),
    idSala: z.number().int().positive("ID da Sala Inválido")
});