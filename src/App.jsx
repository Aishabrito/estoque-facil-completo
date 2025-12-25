import { BrowserRouter, Routes, Route } from 'react-router-dom';
// O StockProvider PRECISA estar importado aqui
import { StockProvider } from './contexts/StockContext'; 

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Entradas from './pages/Entradas';
import Saidas from './pages/Saidas';
import Configuracoes from './pages/Configuracoes';

function App() {
  return (
    // O StockProvider PRECISA abraçar o BrowserRouter
    <StockProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/entradas" element={<Entradas />} />
          <Route path="/saidas" element={<Saidas />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Routes>
      </BrowserRouter>
    </StockProvider>
  )
}

export default App;