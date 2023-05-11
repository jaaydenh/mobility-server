import { PrismaClient, type Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const exerciseData: Prisma.ExerciseCreateInput[] = [
  {
    name: 'Downward Dog',
    description: 'Downward Dog',
    image: 'downward_dog'
  },
  {
    name: 'Hamstring',
    description: 'Hamstring',
    image: 'hamstring1'
  }
]

async function main () {
  console.log('Start seeding ...')
  await prisma.exercise.deleteMany()

  for (const e of exerciseData) {
    const exercise = await prisma.exercise.create({
      data: e
    })
    console.log(`Created exercise with id: ${exercise.id}`)
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
