import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashGerado = await bcrypt.hash('123456', 10);
  const emailAdmin = 'aisha.paola14@gmail.com';

  const admin = await prisma.usuario.upsert({
    where: { email: emailAdmin },
    update: { 
      senhaHash: hashGerado, // CORRIGIDO PARA senhaHash
      isAdmin: true,
      nome: 'Aisha Brito'
    },
    create: {
      nome: 'Aisha Brito',
      email: emailAdmin,
      senhaHash: hashGerado, // CORRIGIDO PARA senhaHash
      isAdmin: true
    }
  });

  console.log(`✅ Sucesso! O usuário ${admin.email} agora é Admin com senhaHash válido.`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });