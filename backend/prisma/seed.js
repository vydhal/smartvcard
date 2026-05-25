const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@simplisoft.com.br'
  
  const existingAdmin = await prisma.empresa.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const admin = await prisma.empresa.create({
      data: {
        nome: 'Administrador Smart vCard',
        email: adminEmail,
        senha_hash: 'admin123' // Em produção, usar bcrypt
      }
    })
    console.log('🌟 Admin criado com sucesso:', admin.email)
  } else {
    console.log('✅ Admin já existia:', existingAdmin.email)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
