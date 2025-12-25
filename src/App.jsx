import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota do Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rota do Dashboard  */}
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App;