import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    MenuItem,
    Box,
    IconButton,
    Tooltip,
    Stack,
    Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFetchList } from "../hooks/useFetchList";
import { FeedbackAlert } from "../components/common/FeedbackAlert";
import { LoadingState } from "../components/common/LoadingState";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export function Home() {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    // Filtros de API (Data e Turno)
    const [dia, setDia] = useState("");
    const [turno, setTurno] = useState("");

    // Filtros e Ordenação locais
    const [buscaNome, setBuscaNome] = useState("");
    const [ordenacao, setOrdenacao] = useState("nome"); // "nome", "precoAsc", "precoDesc", "capacidade"

    // Mensagens de feedback local (ex: ao excluir uma sala)
    const [mensagemLocal, setMensagemLocal] = useState(null);
    const [erroLocal, setErroLocal] = useState(null);

    const query = dia && turno ? `/salas?dia=${dia}&turno=${turno}` : "/salas";
    const { data: salas, loading, erro: erroList, recarregar } = useFetchList(query);

    // Manipulador de exclusão para administradores
    const handleExcluir = async (id, nome) => {
        if (!window.confirm(`Tem certeza que deseja excluir a sala "${nome}"?`)) return;

        setMensagemLocal(null);
        setErroLocal(null);

        try {
            await api.delete(`/salas/${id}`);
            setMensagemLocal("Sala excluída com sucesso!");
            recarregar();
        } catch (error) {
            console.error("Erro ao excluir sala:", error);
            setErroLocal(error.response?.data?.detalhe || "Erro ao excluir a sala.");
        }
    };

    // Aplica filtro de texto por nome e ordenação dinamicamente
    const salasFiltradasEOrdenadas = useMemo(() => {
        if (!salas) return [];

        let resultado = salas.filter((sala) =>
            sala.nome.toLowerCase().includes(buscaNome.toLowerCase())
        );

        return resultado.sort((a, b) => {
            if (ordenacao === "nome") {
                return a.nome.localeCompare(b.nome);
            }
            if (ordenacao === "precoAsc") {
                return Number(a.precoLocacao) - Number(b.precoLocacao);
            }
            if (ordenacao === "precoDesc") {
                return Number(b.precoLocacao) - Number(a.precoLocacao);
            }
            if (ordenacao === "capacidade") {
                return b.capacidade - a.capacidade;
            }
            return 0;
        });
    }, [salas, buscaNome, ordenacao]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Salas Disponíveis
            </Typography>

            <FeedbackAlert mensagem={mensagemLocal} erro={erroLocal || erroList} />

            {/* Barra de Controles: Filtros de Reserva, Busca por Nome e Ordenação */}
            <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Buscar por nome"
                        value={buscaNome}
                        onChange={(e) => setBuscaNome(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        select
                        label="Ordenar por"
                        value={ordenacao}
                        onChange={(e) => setOrdenacao(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="nome">Nome (A-Z)</MenuItem>
                        <MenuItem value="precoAsc">Preço (Menor - Maior)</MenuItem>
                        <MenuItem value="precoDesc">Preço (Maior - Menor)</MenuItem>
                        <MenuItem value="capacidade">Capacidade (Maior)</MenuItem>
                    </TextField>

                    <TextField
                        label="Data da Reserva"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={dia}
                        onChange={(e) => setDia(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        select
                        label="Turno"
                        value={turno}
                        onChange={(e) => setTurno(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="">Todos os turnos</MenuItem>
                        <MenuItem value="Manhã">Manhã</MenuItem>
                        <MenuItem value="Tarde">Tarde</MenuItem>
                        <MenuItem value="Noite">Noite</MenuItem>
                    </TextField>
                </Box>
            </Paper>

            {loading ? (
                <LoadingState />
            ) : salasFiltradasEOrdenadas.length === 0 ? (
                <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                    Nenhuma sala encontrada para os filtros selecionados.
                </Typography>
            ) : (
                /* Grid Fluida Responsiva sem espaços desalinhados */
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: 3,
                    }}
                >
                    {salasFiltradasEOrdenadas.map((sala) => (
                        <Card
                            key={sala.id}
                            elevation={3}
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <CardContent sx={{ pb: 1 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        mb: 1,
                                    }}
                                >
                                    <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                                        {sala.nome}
                                    </Typography>

                                    {/* Ações Administrativas (Editar / Excluir) */}
                                    {isAdmin && (
                                        <Stack direction="row" spacing={0.5}>
                                            <Tooltip title="Editar Sala">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => navigate(`/salas/editar/${sala.id}`)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir Sala">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleExcluir(sala.id, sala.nome)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    )}
                                </Box>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Capacidade: {sala.capacidade} pessoas
                                </Typography>

                                {/* Truncamento de descrição em 2 linhas */}
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 1,
                                        mb: 2,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        minHeight: "2.6em", // garante alinhamento visual mesmo se vazio
                                    }}
                                >
                                    {sala.descricao || "Sem descrição disponível."}
                                </Typography>

                                <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                                    R$ {Number(sala.precoLocacao).toFixed(2)}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button
                                    size="medium"
                                    variant="contained"
                                    fullWidth
                                    onClick={() => navigate(`/reservas/nova?salaId=${sala.id}`)}
                                >
                                    Reservar
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            )}
        </Container>
    );
}