import express from 'express';
import cors from 'cors';
import { routes } from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';

const app = express();

app.use(cors());
app.use(express.json());

// Documentação Swagger (Mantida!)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas do sistema
app.use(routes);

// --- Tratamento de Erros Centralizado (O toque Sênior) ---
app.use((err, req, res, next) => {
  console.error('❌ Erro detectado:', err.message);
  
  if (err.code === 'P2002') {
    return res.status(400).json({ error: 'Este e-mail já está em uso.' });
  }

  res.status(500).json({ 
    error: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.' 
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`\n🚀 API Profissional rodando em http://localhost:${PORT}`);
  console.log(`📖 Documentação disponível em http://localhost:${PORT}/api-docs`);
});