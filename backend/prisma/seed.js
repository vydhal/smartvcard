const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@simplisoft.com.br'
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.empresa.upsert({
    where: { email: adminEmail },
    update: { senha_hash: hashedPassword },
    create: {
      nome: 'Administrador Smart vCard',
      email: adminEmail,
      senha_hash: hashedPassword
    }
  })

  console.log('✅ Admin pronto:', adminEmail)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
