import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StockProvider } from './contexts/StockContext'; 

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Entradas from './pages/Entradas';
import Saidas from './pages/Saidas';
import Configuracoes from './pages/Configuracoes';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StockProvider } from './contexts/StockContext'; 

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Entradas from './pages/Entradas';
import Saidas from './pages/Saidas';
import Configuracoes from './pages/Configuracoes';
import Usuarios from './pages/Usuarios';

function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  if (!token || !usuario) return <Navigate to="/" replace />;
  if (adminOnly && !usuario.isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}

function App() {
  return (
    <StockProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/dashboard"     element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/produtos"      element={<PrivateRoute><Produtos /></PrivateRoute>} />
          <Route path="/entradas"      element={<PrivateRoute><Entradas /></PrivateRoute>} />
          <Route path="/saidas"        element={<PrivateRoute><Saidas /></PrivateRoute>} />
          <Route path="/configuracoes" element={<PrivateRoute><Configuracoes /></PrivateRoute>} />
          <Route path="/usuarios"      element={<PrivateRoute adminOnly={true}><Usuarios /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </StockProvider>
  );
}

export default App;