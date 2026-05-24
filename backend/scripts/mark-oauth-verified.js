const prisma = require('../src/config/db');

(async () => {
  try {
    const result = await prisma.user.updateMany({
      where: { passwordHash: null, emailVerifiedAt: null },
      data: { emailVerifiedAt: new Date() },
    });

    console.log(`Updated ${result.count} users to set emailVerifiedAt`);
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
