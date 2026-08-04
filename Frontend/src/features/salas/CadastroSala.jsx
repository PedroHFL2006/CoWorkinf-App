import { Container, TextField, Button, Typography, Paper, Box, InputAdornment } from "@mui/material";
import { useCadastroForm } from "../../hooks/useCadastroForm";
import { FeedbackAlert } from "../../components/common/FeedbackAlert";

const initialState = {
    nome: "",
    capacidade: "",
    descricao: "",
    precoLocacao: "",
};

// Converte capacidade/preço para Number apenas no momento do envio,
// para bater com a validação do Zod no backend.
function transform(formData) {
    return {
        nome: formData.nome,
        capacidade: parseInt(formData.capacidade),
        descricao: formData.descricao,
        precoLocacao: parseFloat(formData.precoLocacao),
    };
}

export function CadastroSala() {
    const { formData, mensagem, erro, handleChange, handleSubmit } = useCadastroForm({
        endpoint: "/salas",
        initialState,
        mensagemSucesso: "Sala cadastrada com sucesso!",
        transform,
    });

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Cadastro de Nova Sala
                </Typography>

                <FeedbackAlert mensagem={mensagem} erro={erro} />

                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Nome da Sala"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Capacidade (pessoas)"
                        name="capacidade"
                        type="number"
                        value={formData.capacidade}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Descrição"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        fullWidth
                    />

                    <TextField
                        label="Preço de Locação"
                        name="precoLocacao"
                        type="number"
                        value={formData.precoLocacao}
                        onChange={handleChange}
                        required
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        }}
                    />

                    <Button type="submit" variant="contained" color="secondary" size="large" sx={{ mt: 2 }}>
                        Cadastrar
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}