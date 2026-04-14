import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_NOME = process.env.ADMIN_NOME || 'Administrador';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@estoquefacil.com';
const ADMIN_SENHA = process.env.ADMIN_SENHA;

// O TypeScript precisa de uma garantia de que ADMIN_SENHA é string
if (!ADMIN_SENHA) {
  console.error('❌ ADMIN_SENHA não definida. Configure a variável de ambiente antes de executar.');
  process.exit(1);
}

// Criamos uma variável tipada para garantir que não é undefined
const senhaParaHash: string = ADMIN_SENHA;

async function main() {
  // Forçamos o TypeScript a entender que o resultado é uma string
  const hashGerado: string = await bcrypt.hash(senhaParaHash, 10);

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
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });