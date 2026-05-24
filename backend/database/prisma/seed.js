const { PrismaClient } = require('../../../frontend/node_modules/@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'password123'
  const passwordHash = await bcrypt.hash(defaultPassword, 10)

  const pastors = [
    {
      name: 'Senior Pastor',
      email: 'pastor1@church.com',
      password: passwordHash,
      role: 'Senior Pastor',
    },
    {
      name: 'Associate Pastor',
      email: 'pastor2@church.com',
      password: passwordHash,
      role: 'Associate Pastor',
    },
    {
      name: 'Youth Pastor',
      email: 'pastor3@church.com',
      password: passwordHash,
      role: 'Youth Pastor',
    }
  ]

  for (const pastor of pastors) {
    await prisma.user.upsert({
      where: { email: pastor.email },
      update: {},
      create: pastor,
    })
  }
  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
