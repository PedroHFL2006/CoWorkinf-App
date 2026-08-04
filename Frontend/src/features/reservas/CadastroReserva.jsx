import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper, Box, MenuItem } from "@mui/material";
import { useCadastroForm } from "../../hooks/useCadastroForm";
import { useFetchList } from "../../hooks/useFetchList";
import { FeedbackAlert } from "../../components/common/FeedbackAlert";

const initialState = {
    dia: "",
    turno: "Manhã",
    idSala: "",
};

function transform(formData) {
    return {
        dia: formData.dia,
        turno: formData.turno,
        idSala: parseInt(formData.idSala) || "",
    };
}

export function CadastroReserva() {
    const [searchParams] = useSearchParams();
    const salaIdInicial = searchParams.get("salaId") || "";

    const { data: salas, erro: erroSalas } = useFetchList("/salas");

    const { formData, setFormData, mensagem, erro, handleChange, handleSubmit } = useCadastroForm({
        endpoint: "/reservas",
        initialState: { ...initialState, idSala: salaIdInicial },
        mensagemSucesso: "Reserva criada com sucesso!",
        transform,
    });

    // Se veio da Home com uma sala já escolhida (?salaId=...), pré-seleciona
    useEffect(() => {
        if (salaIdInicial) {
            setFormData((prev) => ({ ...prev, idSala: salaIdInicial }));
        }
    }, [salaIdInicial, setFormData]);

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Nova Reserva
                </Typography>

                <FeedbackAlert mensagem={mensagem} erro={erro || erroSalas} />

                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <TextField
                        select
                        label="Sala"
                        name="idSala"
                        value={formData.idSala}
                        onChange={handleChange}
                        required
                        fullWidth
                    >
                        <MenuItem value="">Selecione uma sala</MenuItem>
                        {salas.map((s) => (
                            <MenuItem key={s.id} value={s.id}>{s.nome} (Capacidade: {s.capacidade})</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Data da Reserva"
                        name="dia"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.dia}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        select
                        label="Turno"
                        name="turno"
                        value={formData.turno}
                        onChange={handleChange}
                        required
                        fullWidth
                    >
                        <MenuItem value="Manhã">Manhã</MenuItem>
                        <MenuItem value="Tarde">Tarde</MenuItem>
                        <MenuItem value="Noite">Noite</MenuItem>
                    </TextField>

                    <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
                        Criar Reserva
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}