import express from 'express';
import cors from 'cors';
import { routes } from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routes); // Usa o arquivo de rotas que criamos no passo anterior

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`\n🚀 API Refatorada rodando em http://localhost:${PORT}`);
});