# Guia de Contribuição — Estoque Fácil

Obrigada pelo interesse em contribuir! 🎉  
Siga este guia para manter o projeto consistente e as revisões rápidas.

---

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do ambiente](#configuração-do-ambiente)
3. [Como contribuir](#como-contribuir)
4. [Padrões de commit](#padrões-de-commit)
5. [Testes](#testes)
6. [Abrindo um Pull Request](#abrindo-um-pull-request)

---

## Pré-requisitos

- Node.js **18+**
- npm **9+**
- PostgreSQL (ou conta gratuita no [Supabase](https://supabase.com/))
- Git

---

## Configuração do ambiente

```bash
# 1. Clone o repositório
git clone https://github.com/Aishabrito/estoque-facil-completo.git
cd estoque-facil-completo

# 2. Configure o backend
cd api
cp .env.example .env          # preencha DATABASE_URL e JWT_SECRET
npm install
npx prisma migrate dev
node criarAdmin.js            # cria o usuário admin inicial

# 3. Configure o frontend (em outro terminal)
cd ../web
cp .env.example .env          # preencha VITE_API_URL se necessário
npm install

# 4. Inicie os dois servidores
# Backend (porta 3002)
cd api && npm run dev
# Frontend (porta 5173)
cd web && npm run dev
```

---

## Como contribuir

1. **Abra uma issue** descrevendo o bug ou a funcionalidade antes de codificar.
2. **Crie um branch** a partir de `main`:
   ```bash
   git checkout -b feat/nome-da-feature
   # ou
   git checkout -b fix/descricao-do-bug
   ```
3. Faça suas alterações e garanta que os testes e o lint passam.
4. Abra um Pull Request para `main`.

---

## Padrões de commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Apenas documentação |
| `chore` | Infraestrutura/config |
| `refactor` | Refatoração sem mudança de comportamento |
| `test` | Adição ou correção de testes |

Exemplo: `feat: adicionar filtro por categoria na listagem de produtos`

---

## Testes

### Frontend

```bash
cd web
npm test          # executa todos os testes (vitest)
npm run test:watch  # modo watch durante o desenvolvimento
```

Os testes ficam em `web/src/__tests__/`.

---

## Abrindo um Pull Request

- Descreva **o que** mudou e **por quê**.
- Inclua screenshots para alterações visuais.
- Marque a issue relacionada com `Closes #N`.
- Aguarde a revisão — o CI deve passar antes do merge.
