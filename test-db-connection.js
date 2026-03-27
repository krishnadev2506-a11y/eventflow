const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Attempting to connect to database...')
    await prisma.$connect()
    console.log('✅ Successfully connected to the database!')
    const result = await prisma.$queryRaw`SELECT 1+1 as result`
    console.log('Query result:', result)
  } catch (e) {
    console.error('❌ Connection failed:')
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
