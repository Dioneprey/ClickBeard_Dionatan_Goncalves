import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await hash('senha', 8)

  const userAdmin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@clickbeard.com',
      role: 'ADMIN',
      password: passwordHash
    },
  })
  console.log(`Created new admin user: ${userAdmin.name} (ID: ${userAdmin.id})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })