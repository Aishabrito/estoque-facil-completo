import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const hashGerado = await bcrypt.hash('123456', 10);
  const emailAdmin = 'aisha.paola14@gmail.com';

  const admin = await prisma.usuario.upsert({
    where: { email: emailAdmin },
    update: {
      senhaHash: hashGerado,
      isAdmin: true,
      nome: 'Aisha Brito'
    },
    create: {
      nome: 'Aisha Brito',
      email: emailAdmin,
      senhaHash: hashGerado,
      isAdmin: true
    }
  });

  console.log(`✅ Sucesso! O usuário ${admin.email} agora é Admin com senhaHash válido.`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
