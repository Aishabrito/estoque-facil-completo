
<div align="center">

# 📦 Estoque Fácil

**ERP/PDV Fullstack para pequenos negócios — com inteligência de precificação, controle de acesso e PDV reativo.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com/)
[![Deploy](https://img.shields.io/badge/Deploy-Render_%2B_Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![CI](https://github.com/Aishabrito/estoque-facil-completo/actions/workflows/ci.yml/badge.svg)](https://github.com/Aishabrito/estoque-facil-completo/actions/workflows/ci.yml)

[**🚀 Ver Demo ao Vivo**](https://estoque-facil-completo.vercel.app) · [GitHub](https://github.com/Aishabrito) · [LinkedIn](https://www.linkedin.com/in/aishabrito/)

</div>

---

## 📌 Sobre o Projeto

O **Estoque Fácil** é uma solução ERP/PDV desenvolvida para digitalizar a operação de pequenos negócios. O diferencial é unir **controle de inventário** à **inteligência financeira**, fornecendo ao lojista ferramentas de apoio à decisão para garantir a rentabilidade do negócio.

> Projeto fullstack construído do zero — do banco de dados ao deploy em produção — com foco em arquitetura limpa, segurança via RBAC e experiência de uso fluida.

---

## 🔑 Acesso para Demonstração

O sistema possui controle de acesso por perfil (RBAC). Para explorar todas as funcionalidades, utilize o acesso de Administrador:

| Perfil | E-mail | Senha |
|--------|--------|-------|
| **Administrador** | `demonstracao@estoquefacil.com` | `demo123` |

---

## ✨ Funcionalidades

### 🧮 Inteligência em Precificação & Lucratividade
- **Calculadora de Margem** — calcula automaticamente a Margem Bruta e o Lucro Estimado com base nos custos reais de aquisição
- **Análise de Patrimônio** — monitora o Custo Total Investido em mercadorias (capital imobilizado)
- **Receita Potencial** — projeção dinâmica de faturamento baseada no estoque atual
- **Alertas de Reposição** — identificação visual de produtos com estoque crítico

### 🛒 PDV (Ponto de Venda) Sincronizado
- **Interface Reativa** — carrinho com validação de estoque em tempo real e registro de modalidade de pagamento (Pix, Cartão, Dinheiro)
- **Sincronização via Eventos** — uso de `CustomEvents` para atualizar Dashboard e Histórico instantaneamente após cada venda, sem reload
- **Baixa Automática** — débito no inventário via transações atômicas no banco, garantindo integridade dos dados

### 🔐 Controle de Acesso (RBAC)
- **Dois níveis de acesso:** Admin (gestão total, financeira e de equipe) e Usuário (operações básicas)
- **Gestão de Membros** — interface exclusiva para administradores editarem ou removerem membros
- **Auditabilidade** — rastreamento de qual operador realizou cada movimentação

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias |
|--------|-------------|
| **Backend** | Node.js · Express · Prisma ORM · PostgreSQL (Supabase) · JWT · Bcrypt · Zod |
| **Frontend** | React.js · Vite · Tailwind CSS · Recharts · Lucide Icons · Axios |
| **Deploy** | Render (API) · Vercel (Web) |

---

## 🏗️ Arquitetura do Projeto

```
estoque-facil-completo/
├── api/                          # Backend (Node.js + Express + Prisma)
│   ├── src/
│   │   ├── controllers/          # Regras de negócio (Vendas, Precificação, Dashboard)
│   │   ├── routes/               # Endpoints com proteção RBAC
│   │   └── middlewares/          # Auth JWT + validação Zod
│   ├── prisma/
│   │   └── schema.prisma         # Modelo de dados
│   └── index.js                  # Entry point da API
│
└── web/                          # Frontend (React + Vite)
    ├── src/
    │   ├── pages/                # Dashboard, PDV, Gestão de Equipe
    │   ├── components/           # Componentes reutilizáveis (Sidebar, modais)
    │   ├── contexts/             # Estado global (StockContext)
    │   ├── services/             # Camada de integração com API (Axios)
    │   └── utils/                # Utilitários de precificação e cálculo
    └── index.html
```

---

## 🚀 Rodando Localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL (ou conta no [Supabase](https://supabase.com/))

### 1. Clone o repositório
```bash
git clone https://github.com/Aishabrito/estoque-facil-completo.git
cd estoque-facil-completo
```

### 2. Configure o Backend
```bash
cd api
npm install
```

Crie um arquivo `.env` na pasta `api/`:
```env
DATABASE_URL="postgresql://usuario:senha@host:5432/estoque_facil"
DIRECT_URL="postgresql://usuario:senha@host:5432/estoque_facil"
JWT_SECRET="seu_secret_aqui"
PORT=3002
```

```bash
npx prisma migrate dev
npm run dev
```

### 3. Configure o Frontend
```bash
cd ../web
npm install
```

Crie um arquivo `.env` na pasta `web/`:
```env
VITE_API_URL=http://localhost:3002
```

```bash
npm run dev
```

Acesse em `http://localhost:5173`

---

## 🌐 Deploy em Produção

| Serviço | Plataforma | Variáveis necessárias |
|---------|------------|----------------------|
| **API** | [Render](https://estoque-facil-completo.onrender.com) | `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `PORT` |
| **Web** | [Vercel](https://estoque-facil-completo.vercel.app) | `VITE_API_URL` |

> **Importante:** O Render realiza health check na rota `/`. O servidor está configurado para responder `200 OK` nesse endpoint, garantindo que o deploy fique com status *Live*.

---

## 📖 Documentação da API (Swagger)

A documentação interativa de todos os endpoints está disponível via Swagger UI:

- **Produção:** [`https://estoque-facil-completo.onrender.com/api-docs`](https://estoque-facil-completo.onrender.com/api-docs)
- **Local:** `http://localhost:3002/api-docs`

---

## 🧪 Testes

### Frontend

```bash
cd web
npm test           # executa todos os testes (Vitest)
npm run test:watch # modo watch durante o desenvolvimento
```

Os testes ficam em `web/src/__tests__/` e cobrem utilitários de precificação e cálculo de margem.

---

## ⚙️ CI/CD

O pipeline de CI é executado automaticamente a cada push e Pull Request via **GitHub Actions** (`.github/workflows/ci.yml`):

| Job | Etapas |
|-----|--------|
| Frontend | `npm ci` → `lint` → `test` → `build` |
| Backend | `npm ci` → `prisma generate` |

---

## 📸 Screenshots

>  <img width="1869" height="905" alt="image" src="https://github.com/user-attachments/assets/57bce860-ece0-43bf-a6ee-855989e14c53" />
  <img width="1854" height="904" alt="image" src="https://github.com/user-attachments/assets/f1a9d7b1-74f8-4d81-a119-a81c99cf70e2" />
<img width="1845" height="890" alt="image" src="https://github.com/user-attachments/assets/ef4bb9dd-8657-4a35-8ece-7700d9cf8735" />


---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<div align="center">
  Feito com ☕ por <a href="https://github.com/Aishabrito">Aísha Brito</a>
  <br/><br/>
  <a href="https://github.com/Aishabrito">GitHub</a> · <a href="https://www.linkedin.com/in/aishabrito/">LinkedIn</a>
</div>
