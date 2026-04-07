<h1 align="center">
  <img src="https://img.shields.io/badge/Estoque%20Fácil-000?style=for-the-badge&logo=react&logoColor=61DAFB" alt="Estoque Fácil" />
</h1>

<p align="center">
  Sistema <strong>Fullstack</strong> de gestão de inventário e inteligência de negócio — com PDV reativo, controle de acesso (RBAC) e ferramenta de precificação estratégica.
</p>

<p align="center">
  <a href="https://estoque-facil-completo.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🚀%20Demo%20ao%20vivo-Vercel-black?style=for-the-badge&logo=vercel" />
  </a>
  <img src="https://img.shields.io/badge/Status-Concluído-22c55e?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Licença-MIT-blue?style=for-the-badge" />
</p>

---

## 🔑 Acesso para Demonstração (Quick Start)

O sistema possui controle de acesso restrito por perfil (RBAC). Para explorar as ferramentas de gestão e precificação, utilize o acesso de **Administrador**:

| Perfil | E-mail | Senha |
| :--- | :--- | :--- |
| **Administrador** | `demo@estoquefacil.com` | `demo123` |

---

## 💡 Sobre o Projeto

O **Estoque Fácil** é uma solução ERP/PDV desenvolvida para digitalizar a operação de pequenos negócios. O diferencial do projeto é unir o controle de inventário à **inteligência financeira**, fornecendo ao lojista ferramentas de apoio à decisão para garantir a rentabilidade do negócio.

---

## 🚀 Funcionalidades Estratégicas

### 🧮 Inteligência em Precificação & Lucratividade
- **Calculadora de Margem:** O sistema auxilia o lojista na definição de preços saudáveis ao calcular automaticamente a **Margem Bruta** e o **Lucro Estimado** de cada item com base nos custos reais de aquisição.
- **Análise de Patrimônio:** Monitoramento do **Custo Total Investido**, permitindo visualizar exatamente quanto capital a empresa possui imobilizado em mercadorias.
- **Receita Potencial:** Projeção dinâmica de faturamento total baseada no valor de venda do estoque atual.
- **Alertas de Reposição:** Identificação visual de produtos com estoque crítico, prevenindo a ruptura de vendas.

### 🛒 PDV (Ponto de Venda) Sincronizado
- **Interface Reativa:** Carrinho com validação de estoque em tempo real e registro de modalidade (Pix, Cartão ou Dinheiro).
- **Sincronização via Eventos:** Uso de `CustomEvents` para que o Dashboard e o Histórico atualizem instantaneamente após a venda, sem necessidade de recarregar a página (F5).
- **Baixa Automática:** Débito no inventário validado no servidor via transações atômicas para garantir a integridade dos dados.

### 🔐 Segurança e Gestão de Equipe (RBAC)
- **Níveis de Acesso:** Diferenciação entre **Admin** (gestão total, financeira e equipe) e **Usuário** (operações básicas).
- **Gestão de Membros:** Interface exclusiva para administradores editarem ou removerem membros do sistema.
- **Auditabilidade:** Registro detalhado de qual operador realizou cada movimentação, garantindo total rastreabilidade.

---

## 🛠️ Tecnologias

**Backend:** Node.js, Express, Prisma ORM, PostgreSQL (Supabase), JWT, Bcrypt, Zod, Render.

**Frontend:** React.js, Vite, Tailwind CSS, Recharts, Lucide Icons, Vercel.

---

## 🏗️ Arquitetura

```text
estoque-facil-completo/
├── api/                # Backend (Node.js + Prisma)
│   ├── src/controllers # Regras de negócio (Vendas, Precificação, Dashboard)
│   └── src/routes      # Endpoints da API com proteção RBAC
└── web/                # Frontend (React + Vite)
    ├── src/services    # Camada de integração com API (Axios)
    ├── src/hooks       # Lógica de sincronização e estados reativos
    └── src/pages       # Dashboard, PDV e Gestão de Equipe
