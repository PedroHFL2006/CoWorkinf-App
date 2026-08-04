import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Home } from "./pages/Home";
import { Login } from "./features/auth/Login";
import { CadastroUsuario } from "./features/usuarios/CadastroUsuario";
import { CadastroSala } from "./features/salas/CadastroSala";

import { ListaUsuarios } from "./features/usuarios/ListaUsuarios";
import { ListaSalas } from "./features/salas/ListaSalas";
import { ListaReservas } from "./features/reservas/ListaReservas";
import { CadastroReserva } from "./features/reservas/CadastroReserva";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />

        {/* Protegidas: qualquer usuário logado */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/salas" element={<ProtectedRoute><ListaSalas /></ProtectedRoute>} />
        <Route path="/reservas" element={<ProtectedRoute><ListaReservas /></ProtectedRoute>} />
        <Route path="/reservas/nova" element={<ProtectedRoute><CadastroReserva /></ProtectedRoute>} />

        {/* Protegidas: somente admin */}
        <Route path="/salas/nova" element={<ProtectedRoute adminOnly><CadastroSala /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute adminOnly><ListaUsuarios /></ProtectedRoute>} />
        <Route path="/usuarios/novo" element={<ProtectedRoute adminOnly><CadastroUsuario /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;