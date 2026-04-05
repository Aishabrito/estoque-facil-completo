import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StockProvider } from './contexts/StockContext'; 

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Entradas from './pages/Entradas';
import Saidas from './pages/Saidas';
import Configuracoes from './pages/Configuracoes';

// --- COMPONENTE DE SEGURANÇA (O Guardião) ---
// Ele verifica se existe um token no cofre do navegador.
// Se não existir, ele redireciona para a página de Login (/).
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <StockProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública */}
          <Route path="/" element={<Login />} />

          {/* 🔒 ROTAS PROTEGIDAS 🔒 */}
          {/* Agora todas as páginas internas estão "trancadas" */}
          <Route 
            path="/dashboard" 
            element={<PrivateRoute><Dashboard /></PrivateRoute>} 
          />
          <Route 
            path="/produtos" 
            element={<PrivateRoute><Produtos /></PrivateRoute>} 
          />
          <Route 
            path="/entradas" 
            element={<PrivateRoute><Entradas /></PrivateRoute>} 
          />
          <Route 
            path="/saidas" 
            element={<PrivateRoute><Saidas /></PrivateRoute>} 
          />
          <Route 
            path="/configuracoes" 
            element={<PrivateRoute><Configuracoes /></PrivateRoute>} 
          />

          {/* Rota de "Não Encontrado" - Redireciona para o Login ou Dash */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </StockProvider>
  )
}

export default App;