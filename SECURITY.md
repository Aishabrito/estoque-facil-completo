# Política de Segurança — Estoque Fácil

## Versões suportadas

| Versão | Suportada |
|--------|-----------|
| `main` | ✅ Sim |

---

## Relatando uma vulnerabilidade

**Por favor, NÃO abra uma issue pública para vulnerabilidades de segurança.**

Envie um e-mail para **aisha.paola14@gmail.com** com:

1. Descrição clara da vulnerabilidade.
2. Passos para reproduzir o problema.
3. Impacto potencial (quais dados ou funcionalidades são afetados).
4. Sugestão de correção, se houver.

Você receberá uma resposta em até **72 horas**. Após a confirmação, trabalharemos juntos em uma correção antes de qualquer divulgação pública.

---

## Escopo de segurança

Esta política cobre exclusivamente o código neste repositório. Vulnerabilidades em dependências de terceiros devem ser reportadas diretamente aos mantenedores dessas bibliotecas.

---

## Boas práticas adotadas no projeto

- Senhas armazenadas com **bcrypt** (salt rounds: 10).
- Autenticação via **JWT** com segredo obrigatório via variável de ambiente.
- Controle de acesso por perfil (**RBAC**) com dois níveis: Admin e Usuário.
- Validação de entrada com **Zod** nos endpoints sensíveis.
- Variáveis de ambiente nunca commitadas (`.env` no `.gitignore`).
