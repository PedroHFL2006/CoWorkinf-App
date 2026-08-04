import { useState } from "react";
import { api } from "../services/api";

/**
 * Hook genérico para formulários de cadastro (POST).
 * Centraliza formData, handleChange, handleSubmit e o tratamento
 * de erros (Zod / mensagem "detalhe" do Prisma) que se repetiam
 * em CadastroUsuario, CadastroSala e CadastroReserva.
 *
 * @param {string} endpoint - rota da API (ex: "/usuarios")
 * @param {object} initialState - estado inicial do formulário
 * @param {string} [mensagemSucesso] - mensagem exibida após sucesso
 * @param {(formData: object) => object} [transform] - transforma os
 *   dados antes de enviar (ex: converter strings em number)
 */
export function useCadastroForm({ endpoint, initialState, mensagemSucesso, transform }) {
    const [formData, setFormData] = useState(initialState);
    const [mensagem, setMensagem] = useState(null);
    const [erro, setErro] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem(null);
        setErro(null);

        const dataToSend = transform ? transform(formData) : formData;

        try {
            await api.post(endpoint, dataToSend);
            setMensagem(mensagemSucesso || "Cadastrado com sucesso!");
            setFormData(initialState);
        } catch (error) {
            console.error(`Erro ao enviar para ${endpoint}`, error);
            if (error.response?.data?.errors) {
                const errosZod = error.response.data.errors.map((err) => err.mensagem).join(" | ");
                setErro(`Erro de Validação: ${errosZod}`);
            } else if (error.response?.data?.detalhe) {
                setErro(`Erro: ${error.response.data.detalhe}`);
            } else {
                setErro("Erro interno. Tente novamente.");
            }
        }
    };

    return { formData, setFormData, mensagem, erro, handleChange, handleSubmit };
}