import express from 'express';
import cors from 'cors';

// Puxa o "mapa" de rotas que arrumamos lá dentro da pasta src
import rotas from './src/routes/index.js'; 

const app = express();

// Middlewares essenciais
app.use(cors()); // Permite que o Front-end converse com o Back-end
app.use(express.json()); // Permite que o Back-end entenda os dados dos modais

// Diz para o motor usar o nosso mapa de rotas
app.use(rotas);

// LIGA O SERVIDOR! 🚀
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 Servidor voando na porta ${PORT}`);
});
app.use(cors({
  origin: '*', // Permite que qualquer origem (como a sua Vercel) acesse
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));