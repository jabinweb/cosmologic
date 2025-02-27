import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.payment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  // Create admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@cosmologic.academy',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create instructors
  const instructor1Password = await bcrypt.hash('instructor123', 10);
  const instructor1 = await prisma.user.create({
    data: {
      email: 'sarah@cosmologic.academy',
      password: instructor1Password,
      name: 'Sarah Johnson',
      role: 'INSTRUCTOR',
      specialization: JSON.stringify(['Python', 'Web Development']),
      bio: 'Experienced web developer with 5 years of teaching experience',
      experience: 5,
    },
  });

  // Create parents
  const parentPassword = await bcrypt.hash('parent123', 10);
  const parent = await prisma.user.create({
    data: {
      email: 'parent@example.com',
      password: parentPassword,
      name: 'John Smith',
      role: 'PARENT',
      phone: '+1234567890',
    },
  });

  // Create students
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.create({
    data: {
      email: 'student@example.com',
      password: studentPassword,
      name: 'Tommy Smith',
      role: 'STUDENT',
      parentId: parent.id,
      grade: '8th Grade',
      age: 13,
    },
  });

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      name: 'Python for Beginners',
      description: 'Learn Python programming from scratch',
      price: 2499,
      features: JSON.stringify([
        'Basic programming concepts',
        'Python syntax',
        'Simple projects',
      ]),
      level: 'Beginners',
      instructorId: instructor1.id,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      name: 'Web Development Basics',
      description: 'Introduction to HTML, CSS, and JavaScript',
      price: 3499,
      features: JSON.stringify([
        'HTML fundamentals',
        'CSS styling',
        'JavaScript basics',
      ]),
      level: 'Beginners',
      instructorId: instructor1.id,
    },
  });

  // Create subscriptions first
  const subscription = await prisma.subscription.create({
    data: {
      userId: student.id,
      planId: 'pro',
      orderId: 'order_123',
      status: 'ACTIVE',
      amount: 1999,
      activatedAt: new Date(),
    },
  });

  // Create payment linked to subscription
  const payment = await prisma.payment.create({
    data: {
      subscriptionId: subscription.id, // Link to subscription instead of enrollment
      amount: 1999,
      currency: 'INR',
      status: 'success',
      razorpayId: 'pay_123456',
    },
  });

  // Create enrollment with payment
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      status: 'active',
      paymentId: payment.id, // Reference the payment
    },
  });

  // Create coupons
  await prisma.coupon.create({
    data: {
      code: 'WELCOME20',
      discount: 20,
      maxUses: 100,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
