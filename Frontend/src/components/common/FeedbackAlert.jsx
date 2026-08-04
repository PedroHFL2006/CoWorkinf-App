import { Alert } from "@mui/material";

/**
 * Exibe mensagem de sucesso e/ou erro.
 * Substitui os dois <Alert> repetidos em todas as telas de Cadastro/Lista.
 */
export function FeedbackAlert({ mensagem, erro }) {
    if (!mensagem && !erro) return null;

    return (
        <>
            {mensagem && <Alert severity="success" sx={{ mb: 2 }}>{mensagem}</Alert>}
            {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
        </>
    );
}