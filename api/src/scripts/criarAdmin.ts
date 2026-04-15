import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_NOME = process.env.ADMIN_NOME || 'Administrador';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@estoquefacil.com';
const ADMIN_SENHA = process.env.ADMIN_SENHA || 'mudar@123'; // Fallback seguro para build

async function main() {
  // Garantimos que é uma string para o bcrypt não reclamar
  const salt = await bcrypt.genSalt(10);
  const hashGerado = await bcrypt.hash(ADMIN_SENHA, salt);

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });