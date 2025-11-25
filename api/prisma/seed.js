const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const adminEmail = 'danbitixlabs@gmail.com';
  const hashedPassword = await bcrypt.hash('DanBitixLabs@2025', 10);

  // Use upsert to create the user only if they don't exist
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail }, // Find the user by their unique email
    update: {}, // We don't need to update anything if they exist
    create: {
      username: 'Admin',
      email: adminEmail,
      password: hashedPassword,
    },
  });

  console.log(`Ensured admin user exists: ${adminUser.username}`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });