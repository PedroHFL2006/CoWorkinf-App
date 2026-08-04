import { Container, Typography } from "@mui/material";
import { useFetchList } from "../../hooks/useFetchList";
import { DataTable } from "../../components/common/DataTable";
import { LoadingState } from "../../components/common/LoadingState";
import { FeedbackAlert } from "../../components/common/FeedbackAlert";

const columns = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome" },
    { key: "email", label: "E-mail" },
    { key: "telefone", label: "Telefone" },
    { key: "cpf", label: "CPF" },
];

export function ListaUsuarios() {
    const { data: usuarios, loading, erro } = useFetchList("/usuarios");

    return (
        <Container maxWidth="md">
            <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
                Usuários Cadastrados
            </Typography>

            <FeedbackAlert erro={erro} />

            {loading ? (
                <LoadingState />
            ) : (
                <DataTable columns={columns} rows={usuarios} emptyMessage="Nenhum usuário cadastrado." />
            )}
        </Container>
    );
}