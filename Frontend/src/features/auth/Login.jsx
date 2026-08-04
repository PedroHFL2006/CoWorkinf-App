import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper, Box, Alert } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const destinoAposLogin = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(null);
        setCarregando(true);

        try {
            await login(email, senha);
            navigate(destinoAposLogin, { replace: true });
        } catch (error) {
            const mensagem = error.response?.data?.error || "Não foi possível fazer login.";
            setErro(mensagem);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Entrar
                </Typography>

                {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        autoFocus
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        fullWidth
                    />
                    <Button type="submit" variant="contained" size="large" disabled={carregando}>
                        {carregando ? "Entrando..." : "Entrar"}
                    </Button>
                </Box>

                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                    Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
                </Typography>
            </Paper>
        </Container>
    );
}