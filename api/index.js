import express from 'express';
import cors from 'cors';
import rotas from './src/routes/index.js'; 

const app = express();

// ✅ CORS primeiro
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Responde ao preflight do browser (ESSENCIAL para o login funcionar)
app.options('*', cors());

app.use(express.json());

// ✅ Health check — o Render bate aqui para saber se o servidor está vivo
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(rotas);

// Tratamento de erros (estava ótimo, mantive igual)
app.use((err, req, res, next) => {
  console.error('❌ Erro detectado:', err.message);
  
  if (err.code === 'P2002') {
    return res.status(400).json({ error: 'Este registro já existe no sistema.' });
  }

  res.status(500).json({ 
    error: 'Ocorreu um erro interno no servidor. Verifique os logs no Render.' 
  });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ API Profissional Rodando!`);
  console.log(`🌍 URL Local: http://localhost:${PORT}`);
  console.log(`🚀 No Deploy: Porta detectada ${PORT}`);
});