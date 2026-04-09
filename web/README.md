# Estoque Fácil — Frontend

Interface web do sistema ERP/PDV Estoque Fácil, construída com **React 19 + Vite + Tailwind CSS**.

---

## Tecnologias

| Pacote | Função |
|--------|--------|
| React 19 | Interface declarativa e reativa |
| Vite 7 | Build tool e dev server |
| Tailwind CSS 3 | Estilização utility-first |
| Axios | Comunicação com a API |
| React Router 7 | Navegação entre páginas |
| Recharts | Gráficos do Dashboard |
| Lucide React | Ícones |

---

## Desenvolvimento local

```bash
cp .env.example .env    # configure VITE_API_URL
npm install
npm run dev             # http://localhost:5173
```

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run lint` | Verifica o código com ESLint |
| `npm test` | Executa os testes com Vitest |
| `npm run test:watch` | Executa os testes em modo watch |
| `npm run preview` | Pré-visualiza o build de produção |

---

## Estrutura

```
src/
├── pages/          # Dashboard, Produtos, Vendas, Configurações...
├── components/     # Sidebar e modais reutilizáveis
├── contexts/       # StockContext (estado global via Context API)
├── services/       # api.js — cliente Axios com interceptors JWT
├── utils/          # precificacao.js — cálculos de margem e markup
└── __tests__/      # Testes unitários (Vitest)
```

---

## Testes

Os testes ficam em `src/__tests__/` e são executados com [Vitest](https://vitest.dev/).

```bash
npm test
```

---

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL base da API backend | `http://localhost:3002` |

Copie `.env.example` para `.env` e preencha conforme necessário.

