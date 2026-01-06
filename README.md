# 📦 Estoque Fácil - Sistema de Gestão

> 🚧 **Status:** Em desenvolvimento (MVP - Minimum Viable Product)

## 🎯 Sobre o Projeto

O **Estoque Fácil** é uma aplicação Fullstack desenvolvida para facilitar o controle de entrada e saída de produtos para pequenos comércios.

Como desenvolvedora Júnior, meu principal objetivo com este projeto é criar um laboratório prático para conectar um **Front-end moderno** com um **Banco de Dados relacional**, entendendo a fundo o fluxo da informação e a arquitetura de software.

---

## 💡 Objetivos de Aprendizado

Não é apenas sobre criar telas, é sobre entender o sistema completo. Neste projeto, estou focada em:

- **Integração Fullstack:** Consumir uma API RESTful (Node.js) através de uma aplicação React.
- **Modelagem de Dados:** Criar schemas relacionais eficientes com Prisma e PostgreSQL.
- **Gerenciamento de Estado:** Manipular dados no Front-end garantindo que a interface reaja instantaneamente às mudanças do banco.
- **Boas Práticas:** Implementar validações e tratamento de erros para evitar quebras no sistema.

---

## 🛠️ Tech Stack

Utilizei uma stack robusta e amplamente solicitada pelo mercado:

### Front-end
- ![React](https://img.shields.io/badge/-React-20232A?style=flat-square&logo=react&logoColor=61DAFB) **React.js:** Construção da interface baseada em componentes.
- ![Tailwind](https://img.shields.io/badge/-Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) **Tailwind CSS:** Estilização responsiva e ágil.
- ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) **Vite:** Build tool para alta performance.

### Back-end & Dados
- ![Node](https://img.shields.io/badge/-Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) **Node.js & Express:** Servidor e rotas da API.
- ![Prisma](https://img.shields.io/badge/-Prisma-2d3748?style=flat-square&logo=prisma&logoColor=white) **Prisma ORM:** Abstração e segurança na comunicação com o banco.
- ![Postgres](https://img.shields.io/badge/-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white) **PostgreSQL:** Banco de dados relacional.

---

## 🧠 Desafios & Soluções Técnicas

> *Os principais obstáculos que enfrentei e superei durante o desenvolvimento:*

* **1. Política de CORS:** Tive problemas iniciais ao conectar o Front-end (porta 5173) com a API (porta 3000). Resolvi configurando corretamente os headers e o middleware `cors` no Express, entendendo na prática como os navegadores bloqueiam requisições entre origens diferentes.

* **2. Sincronia de Estado (React):** Um desafio foi manter a UI atualizada após o cadastro de um produto sem precisar recarregar a página. A solução foi refatorar a lógica para atualizar o estado local (`setState`) assim que a API retorna o sucesso (Optimistic UI updates).

* **3. Modelagem com Prisma:** Definir relacionamentos no banco de dados (ex: Categorias e Produtos) exigiu estudo da documentação do Prisma ORM para entender como funcionam as *Foreign Keys* e migrações.

* **4. Error Handling:** Para evitar que o servidor "caísse" ao receber dados incompletos no `POST`, implementei blocos `try/catch` nos controllers, garantindo que a API sempre responda com status codes apropriados (400, 500) e mensagens claras.

---

## 🚀 Como rodar o projeto localmente

Para testar o código na sua máquina:

```bash
# 1. Clone o repositório
git clone [https://github.com/Aishabrito/estoque-facil.git](https://github.com/Aishabrito/estoque-facil.git)

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env na raiz baseado no .env.example

# 4. Inicie o projeto (Front e Back)
npm run dev
