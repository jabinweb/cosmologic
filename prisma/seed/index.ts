import { PrismaClient } from '@prisma/client';
import { seedUsers } from './users';
import { seedCourses } from './courses';
import { seedPlans } from './plans';

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Delete in correct order to respect foreign key constraints
    console.log('🧹 Cleaning up database...');
    
    // 1. Delete child records first
    await prisma.payment.deleteMany();
    console.log('✓ Payments deleted');
    
    await prisma.enrollment.deleteMany();
    console.log('✓ Enrollments deleted');
    
    await prisma.subscription.deleteMany();
    console.log('✓ Subscriptions deleted');

    // 2. Delete standalone records
    await prisma.verificationToken.deleteMany();
    await prisma.passwordReset.deleteMany();
    console.log('✓ Tokens deleted');

    await prisma.plan.deleteMany();
    console.log('✓ Plans deleted');
    
    await prisma.coupon.deleteMany();
    console.log('✓ Coupons deleted');

    // 3. Delete courses before users due to instructor relationship
    await prisma.course.deleteMany();
    console.log('✓ Courses deleted');

    // 4. Finally delete users (need to handle parent-child relationship)
    await prisma.$executeRaw`UPDATE "User" SET "parentId" = NULL WHERE "parentId" IS NOT NULL;`;
    await prisma.user.deleteMany();
    console.log('✓ Users deleted');

  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
}

async function main() {
  try {
    await clearDatabase();
    
    console.log('\n🌱 Starting seed...');
    
    const users = await seedUsers(prisma);
    console.log('✓ Users seeded:', users.length);
    
    const courses = await seedCourses(prisma, users);
    console.log('✓ Courses seeded:', courses.length);
    
    const plans = await seedPlans(prisma);
    console.log('✓ Plans seeded:', plans.length);

    console.log('\n✅ Database seeded successfully!');
    
  } catch (error) {
    console.error('\n❌ Seed error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
