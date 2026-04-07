import express from 'express';
import cors from 'cors';

// Importa o mapa de rotas (ajuste o caminho se o seu arquivo estiver em outro lugar)
import rotas from './src/routes/index.js'; 

const app = express();

// ==========================================
// 🛡️ CONFIGURAÇÃO GLOBAL DE CORS
// ==========================================
// O CORS deve ser o PRIMEIRO middleware para evitar o "carregando infinito"
app.use(cors({
  origin: '*', // Durante o deploy, o '*' garante que a Vercel consiga conectar
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Permite que o Express entenda o corpo das requisições (JSON)
app.use(express.json());

// ==========================================
// 🚀 DEFINIÇÃO DAS ROTAS
// ==========================================
app.use(rotas);

// ==========================================
// ⚠️ TRATAMENTO DE ERROS (Toque Sênior)
// ==========================================
app.use((err, req, res, next) => {
  console.error('❌ Erro detectado:', err.message);
  
  // Erro específico do Prisma (Unique constraint)
  if (err.code === 'P2002') {
    return res.status(400).json({ error: 'Este registro já existe no sistema.' });
  }

  res.status(500).json({ 
    error: 'Ocorreu um erro interno no servidor. Verifique os logs no Render.' 
  });
});

// ==========================================
// 📡 LIGA O SERVIDOR
// ==========================================
// O Render define a porta automaticamente via process.env.PORT
const PORT = process.env.PORT || 3002;

// Usamos '0.0.0.0' para garantir que o servidor aceite conexões externas
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ API Profissional Rodando!`);
  console.log(`🌍 URL Local: http://localhost:${PORT}`);
  console.log(`🚀 No Deploy: Porta detectada ${PORT}`);
});