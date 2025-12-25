import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import Produtos from './pages/Produtos';
import Entradas from './pages/Entradas';
import Saidas from './pages/Saidas';     
import Configuracoes from './pages/Configuracoes'; 

function App() {
  return (
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
  )
}

export default App;