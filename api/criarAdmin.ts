import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_NOME = process.env.ADMIN_NOME || 'Administrador';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@estoquefacil.com';
const ADMIN_SENHA = process.env.ADMIN_SENHA;

if (!ADMIN_SENHA) {
  console.error('❌ ADMIN_SENHA não definida. Configure a variável de ambiente antes de executar.');
  process.exit(1);
}

async function main() {
  const hashGerado = await bcrypt.hash(ADMIN_SENHA, 10);

  const admin = await prisma.usuario.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      senhaHash: hashGerado,
      isAdmin: true,
      nome: ADMIN_NOME
    },
    create: {
      nome: ADMIN_NOME,
      email: ADMIN_EMAIL,
      senhaHash: hashGerado,
      isAdmin: true
    }
  });

  console.log(`✅ Sucesso! O usuário ${admin.email} agora é Admin.`);
  console.log('⚠️  IMPORTANTE: Altere a senha padrão após o primeiro login!');
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });