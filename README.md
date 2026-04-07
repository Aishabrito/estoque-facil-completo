<h1 align="center">
  <img src="https://img.shields.io/badge/Estoque%20Fácil-000?style=for-the-badge&logo=react&logoColor=61DAFB" alt="Estoque Fácil" />
</h1>

<p align="center">
  Sistema <strong>Fullstack</strong> de gestão de inventário e fluxo de caixa — com PDV sincronizado, controle de acesso por perfil (RBAC) e painel de indicadores operacionais.
</p>

<p align="center">
  <a href="https://estoque-facil-completo.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🚀%20Demo%20ao%20vivo-Vercel-black?style=for-the-badge&logo=vercel" />
  </a>
  <img src="https://img.shields.io/badge/Status-Concluído-22c55e?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Licença-MIT-blue?style=for-the-badge" />
</p>

---

## 🔑 Acesso para Demonstração

| Perfil | E-mail | Senha |
| :--- | :--- | :--- |
| **Administrador** | `demo@estoquefacil.com` | `demo123` |

---

## 💡 Sobre o projeto

O **Estoque Fácil** é um MVP voltado para a digitalização de processos em pequenos comércios. O foco foi construir uma integração Fullstack real e consistente — cobrindo modelagem de banco de dados, API REST, autenticação, controle de acesso e deploy em produção.

O projeto vai além do CRUD: implementa autenticação com JWT, controle de acesso por perfil (RBAC), validação rigorosa de dados no servidor e sincronização reativa entre componentes no frontend.

---

## 🚀 Funcionalidades

### 📊 Dashboard de Indicadores
- Faturamento mensal calculado via agregações do Prisma
- Monitoramento de patrimônio (custo) e receita potencial (valor de venda)
- Alertas visuais para produtos abaixo do estoque mínimo configurado
- Feed em tempo real das últimas 10 movimentações do sistema

### 🛒 PDV (Ponto de Venda)
- Carrinho dinâmico com validação de estoque disponível em tempo real
- Seleção de forma de pagamento: Pix, Cartão ou Dinheiro
- Baixa automática no estoque ao confirmar a venda
- Dashboard e Histórico atualizam instantaneamente, sem recarregar a página

### 🔐 Autenticação e Controle de Acesso (RBAC)
- Sessões protegidas com JWT
- Perfis diferenciados: Admin (gestão total) e Usuário (operações básicas)
- Painel de gestão de equipe exclusivo para administradores
- Rotas protegidas por middleware de autorização no backend

---

## 🛠️ Tecnologias

**Backend**

| Tecnologia | Uso |
| :--- | :--- |
| Node.js + Express | Servidor e API REST |
| Prisma ORM | Comunicação e migrations do banco |
| PostgreSQL (Supabase) | Banco de dados em produção |
| JWT + Bcrypt | Autenticação e hash de senhas |
| Zod | Validação de schemas |
| Render | Deploy da API |

**Frontend**

| Tecnologia | Uso |
| :--- | :--- |
| React.js + Vite | Interface reativa e build otimizado |
| Tailwind CSS | Estilização utilitária |
| Recharts | Gráficos do dashboard |
| Lucide Icons | Ícones |
| Vercel | Deploy do frontend |

---

## 🏗️ Arquitetura
**Fluxo de dados:**
`Usuário → React (Vercel) → API REST (Render) → Prisma ORM → PostgreSQL (Supabase)`

---

## ⚙️ Como rodar localmente

**Pré-requisitos:** Node.js v18+, npm, conta no Supabase (ou PostgreSQL local)

**1. Clone o repositório**
```bash
git clone https://github.com/Aishabrito/estoque-facil-completo.git
cd estoque-facil-completo
```

**2. Configure e rode o backend**
```bash
cd api
npm install
cp .env.example .env   # preencha as variáveis
npx prisma migrate dev
npm run dev
# servidor disponível em http://localhost:3333
```

**3. Configure e rode o frontend**
```bash
cd ../web
npm install
cp .env.example .env   # informe a URL da API
npm run dev
# aplicação disponível em http://localhost:5173
```

---

## 🔑 Variáveis de Ambiente

**api/.env**
```env
DATABASE_URL="postgresql://usuario:senha@host:5432/estoque_facil"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3333
```

**web/.env**
```env
VITE_API_URL="http://localhost:3333"
```

> ⚠️ Nunca suba arquivos `.env` para o repositório. Confirme que `.env` está no `.gitignore`.

---

## 🧠 Decisões Técnicas

**Sincronização entre componentes sem gerenciador de estado externo**
Para que o Dashboard atualize após uma venda sem recarregar a página, utilizei `CustomEvents` nativos do JavaScript — uma solução leve para comunicação entre componentes irmãos, sem a necessidade de Redux ou Context API global.

**Integridade de dados garantida no servidor**
A validação de estoque negativo é feita no backend via Prisma antes de qualquer escrita no banco. Se qualquer etapa falha, a operação é revertida — garantindo consistência do inventário independente do cliente.

**Deploy Fullstack em produção**
Configurei CORS entre domínios diferentes, variáveis de ambiente no Render e Vercel, e banco PostgreSQL externo no Supabase — lidando com os desafios reais de um ambiente de produção.

**Segurança com JWT e RBAC**
Dois níveis de acesso (Admin/Usuário) com middleware de autorização no backend e proteção de rotas no frontend — garantindo que cada perfil acesse apenas o que deve.

---

<p align="center">
  Desenvolvido por <strong>Aísha Brito</strong>
  <br><br>
  Se esse projeto te ajudou ou te inspirou, deixa uma ⭐
</p>
