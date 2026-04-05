import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Configurando conta de Administrador...');
  
  // Criptografando a senha "123456"
  const senhaHash = await bcrypt.hash('123456', 10);
  const emailAdmin = 'aisha.paola14@gmail.com';

  // O "upsert" atualiza se o usuário já existir, ou cria se não existir!
  const admin = await prisma.usuario.upsert({
    where: { email: emailAdmin },
    update: { 
      senha: senhaHash, 
      isAdmin: true,
      nome: 'Aisha Brito' // Usando seu nome corrigido!
    },
    create: {
      nome: 'Aisha Brito',
      email: emailAdmin,
      senha: senhaHash,
      isAdmin: true
    }
  });

  console.log(`✅ Sucesso! O usuário ${admin.email} agora é Admin.`);
  console.log('🔑 Senha de acesso: 123456');
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });