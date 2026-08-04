import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAuth } from "../../context/AuthContext";
import { useThemeMode } from "../../context/ThemeContext";

export function Navbar() {
    const { isAuthenticated, isAdmin, usuario, logout } = useAuth();
    const { mode, toggleTheme } = useThemeMode();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    CoWorking App
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                    {isAuthenticated ? (
                        <>
                            <Button color="inherit" component={Link} to="/">Salas</Button>
                            <Button color="inherit" component={Link} to="/reservas">Minhas Reservas</Button>

                            {isAdmin && (
                                <>
                                    <Button color="inherit" component={Link} to="/salas/nova">Nova Sala</Button>
                                    <Button color="inherit" component={Link} to="/usuarios">Usuários</Button>
                                </>
                            )}

                            <Typography variant="body2" sx={{ ml: 2, mr: 1 }}>
                                Olá, {usuario?.nome?.split(" ")[0]}
                            </Typography>

                            {/* Alternador de Tema (Dark/Light) */}
                            <Tooltip title={mode === "dark" ? "Modo Claro" : "Modo Escuro"}>
                                <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
                                    {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                                </IconButton>
                            </Tooltip>

                            <Button color="inherit" variant="outlined" onClick={handleLogout} sx={{ borderColor: 'white' }}>
                                Sair
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* Alternador de Tema para usuários não autenticados */}
                            <Tooltip title={mode === "dark" ? "Modo Claro" : "Modo Escuro"}>
                                <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
                                    {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                                </IconButton>
                            </Tooltip>

                            <Button color="inherit" component={Link} to="/login">Entrar</Button>
                            <Button color="inherit" component={Link} to="/cadastro" variant="outlined" sx={{ borderColor: 'white' }}>
                                Cadastre-se
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}