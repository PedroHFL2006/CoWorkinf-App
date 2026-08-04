import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useCadastroForm } from "../../hooks/useCadastroForm";
import { FeedbackAlert } from "../../components/common/FeedbackAlert";
import { useAuth } from "../../context/AuthContext";

const initialState = {
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    cpf: "",
};

export function CadastroUsuario() {
    const { isAuthenticated } = useAuth();
    const { formData, mensagem, erro, handleChange, handleSubmit } = useCadastroForm({
        endpoint: "/usuarios",
        initialState,
        mensagemSucesso: "Usuário cadastrado com sucesso!",
    });

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Cadastro de Novo Usuário
                </Typography>

                <FeedbackAlert mensagem={mensagem} erro={erro} />

                {mensagem && !isAuthenticated && (
                    <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                        <Link to="/login">Ir para o login</Link>
                    </Typography>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="E-mail"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Senha"
                        name="senha"
                        type="password"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Telefone (mín. 10 dígitos)"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="CPF (apenas 11 números)"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        required
                        fullWidth
                        inputProps={{ maxLength: 11 }}
                    />

                    <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
                        Cadastrar
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}