import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import Produtos from './pages/Produtos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/produtos" element={<Produtos />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;