const prisma = require('../src/config/db');

(async () => {
  try {
    const email = 'sharleez.work@gmail.com';
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true, onboardingStep: true, emailVerifiedAt: true }
    });
    console.log(user || `No user found for ${email}`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();
