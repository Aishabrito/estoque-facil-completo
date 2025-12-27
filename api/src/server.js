import express from 'express';
import cors from 'cors';
import { routes } from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes); // Usa o arquivo de rotas que criamos no passo anterior

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`\n🚀 API Refatorada rodando em http://localhost:${PORT}`);
});