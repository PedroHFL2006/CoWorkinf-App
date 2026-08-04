import { useState, useMemo } from "react";
import { Container, Typography, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFetchList } from "../../hooks/useFetchList";
import { DataTable } from "../../components/common/DataTable";
import { LoadingState } from "../../components/common/LoadingState";
import { FeedbackAlert } from "../../components/common/FeedbackAlert";
import { api } from "../../services/api";

// Função utilitária para formatar a data sem sofrer com desvio de fuso horário
const formatarDataLocal = (valorData) => {
    if (!valorData) return "-";

    // Se vier como string "YYYY-MM-DD" ou com timestamp ISO "YYYY-MM-DDT..."
    const strData = String(valorData);
    
    // Se estiver no formato YYYY-MM-DD
    if (strData.includes("-")) {
        const [ano, mes, diaComHora] = strData.split("-");
        const dia = diaComHora.split("T")[0]; // Remove eventual hora T00:00:00
        return `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}/${ano}`;
    }

    // Fallback para conversão padrão se já for Date/timestamp
    try {
        return new Date(valorData).toLocaleDateString("pt-BR", { timeZone: "UTC" });
    } catch {
        return "-";
    }
};

export function ListaReservas() {
    const { data: reservas, loading, erro: erroFetch, recarregar } = useFetchList("/reservas");
    const [mensagemLocal, setMensagemLocal] = useState(null);
    const [erroLocal, setErroLocal] = useState(null);

    const handleExcluir = async (id) => {
        if (!window.confirm("Tem certeza que deseja cancelar/excluir esta reserva?")) {
            return;
        }

        setMensagemLocal(null);
        setErroLocal(null);

        try {
            await api.delete(`/reservas/${id}`);
            setMensagemLocal("Reserva cancelada/excluída com sucesso!");
            recarregar();
        } catch (error) {
            console.error("Erro ao excluir reserva:", error);
            setErroLocal(
                error.response?.data?.detalhe || "Erro ao cancelar a reserva. Tente novamente."
            );
        }
    };

    const columns = useMemo(
        () => [
            { key: "id", label: "ID" },
            {
                key: "data",
                label: "Data",
                render: (row) => formatarDataLocal(row.data),
            },
            { key: "turno", label: "Turno" },
            {
                key: "usuario",
                label: "Usuário",
                render: (row) => row.usuario?.nome || "N/A",
            },
            {
                key: "sala",
                label: "Sala",
                render: (row) => row.sala?.nome || "N/A",
            },
            {
                key: "acoes",
                label: "Ações",
                render: (row) => (
                    <Tooltip title="Excluir Reserva">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleExcluir(row.id)}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                ),
            },
        ],
        []
    );

    return (
        <Container maxWidth="md">
            <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
                Reservas Cadastradas
            </Typography>

            <FeedbackAlert mensagem={mensagemLocal} erro={erroLocal || erroFetch} />

            {loading ? (
                <LoadingState />
            ) : (
                <DataTable
                    columns={columns}
                    rows={reservas}
                    emptyMessage="Nenhuma reserva cadastrada."
                />
            )}
        </Container>
    );
}