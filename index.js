import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

// Carrega as variáveis do arquivo .env
dotenv.config();

const { Pool } = pg;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO DA CONEXÃO (Usando Transaction Pooler para IPv4)
const pool = new Pool({
  // Montamos a string com a sua senha e o ID do projeto que você confirmou
  connectionString: "postgresql://postgres.punpoymvhyigizkcgdhw:pm1NQ0hEiDgeNcyj@aws-1-us-east-2.pooler.supabase.com:6543/postgres",
  ssl: {
    // Resolve o erro "self-signed certificate in certificate chain"
    rejectUnauthorized: false 
  }
});

// Função para testar conexão e criar a tabela automaticamente
const setupDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log("🚀 Conexão com Supabase estabelecida com sucesso!");
    
    // Cria a tabela de produtos se ela não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        categoria VARCHAR(100),
        preco DECIMAL(10,2) NOT NULL,
        estoque INTEGER NOT NULL DEFAULT 0,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("✅ Tabela 'produtos' verificada/criada no banco.");
    client.release();
  } catch (err) {
    console.error("❌ Erro ao configurar banco:", err.message);
  }
};

// Executa a configuração inicial
setupDatabase();

// --- ROTAS DA API ---

// Rota de teste no navegador
app.get('/', (req, res) => {
  res.send("API de Estoque Online! 🚀");
});

// Rota para listar todos os produtos
app.get('/produtos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para cadastrar um novo produto
app.post('/produtos', async (req, res) => {
  const { nome, categoria, preco, estoque } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO produtos (nome, categoria, preco, estoque) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, categoria, preco, estoque]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicia o servidor na porta 3002 (para evitar o erro EADDRINUSE na 3001)
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`\n📡 Servidor rodando em http://localhost:${PORT}`);
  console.log(`💡 Para testar a conexão, acesse o link acima no navegador.\n`);
});