import { Container, Typography } from "@mui/material";
import { useFetchList } from "../../hooks/useFetchList";
import { DataTable } from "../../components/common/DataTable";
import { LoadingState } from "../../components/common/LoadingState";
import { FeedbackAlert } from "../../components/common/FeedbackAlert";

const columns = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome" },
    { key: "capacidade", label: "Capacidade", render: (sala) => `${sala.capacidade} pessoas` },
    { key: "precoLocacao", label: "Preço/Locação", render: (sala) => `R$ ${Number(sala.precoLocacao).toFixed(2)}` },
];

export function ListaSalas() {
    const { data: salas, loading, erro } = useFetchList("/salas");

    return (
        <Container maxWidth="md">
            <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
                Salas Cadastradas
            </Typography>

            <FeedbackAlert erro={erro} />

            {loading ? (
                <LoadingState />
            ) : (
                <DataTable columns={columns} rows={salas} emptyMessage="Nenhuma sala cadastrada." />
            )}
        </Container>
    );
}