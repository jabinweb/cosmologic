import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  // await prisma.payment.deleteMany();
  // await prisma.enrollment.deleteMany();
  // await prisma.course.deleteMany();
  // await prisma.coupon.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.comment.deleteMany();
  // await prisma.post.deleteMany();
  // await prisma.topic.deleteMany();
  await prisma.forum.deleteMany();

  // Create admin
  // const adminPassword = await bcrypt.hash('admin123', 10);
  // const admin = await prisma.user.create({
  //   data: {
  //     email: 'admin@cosmologic.academy',
  //     password: adminPassword,
  //     name: 'Admin User',
  //     role: 'ADMIN',
  //   },
  // });

  // // Create instructors
  // const instructor1Password = await bcrypt.hash('instructor123', 10);
  // const instructor1 = await prisma.user.create({
  //   data: {
  //     email: 'sarah@cosmologic.academy',
  //     password: instructor1Password,
  //     name: 'Sarah Johnson',
  //     role: 'INSTRUCTOR',
  //     specialization: JSON.stringify(['Python', 'Web Development']),
  //     bio: 'Experienced web developer with 5 years of teaching experience',
  //     experience: 5,
  //   },
  // });

  // // Create parents
  // const parentPassword = await bcrypt.hash('parent123', 10);
  // const parent = await prisma.user.create({
  //   data: {
  //     email: 'parent@example.com',
  //     password: parentPassword,
  //     name: 'John Smith',
  //     role: 'PARENT',
  //     phone: '+1234567890',
  //   },
  // });

  // // Create students
  // const studentPassword = await bcrypt.hash('student123', 10);
  // const student = await prisma.user.create({
  //   data: {
  //     email: 'student@example.com',
  //     password: studentPassword,
  //     name: 'Tommy Smith',
  //     role: 'STUDENT',
  //     parentId: parent.id,
  //     grade: '8th Grade',
  //     age: 13,
  //   },
  // });

  // // Create courses
  // const course1 = await prisma.course.create({
  //   data: {
  //     name: 'Python for Beginners',
  //     description: 'Learn Python programming from scratch',
  //     price: 2499,
  //     features: JSON.stringify([
  //       'Basic programming concepts',
  //       'Python syntax',
  //       'Simple projects',
  //     ]),
  //     level: 'Beginners',
  //     instructorId: instructor1.id,
  //   },
  // });

  // const course2 = await prisma.course.create({
  //   data: {
  //     name: 'Web Development Basics',
  //     description: 'Introduction to HTML, CSS, and JavaScript',
  //     price: 3499,
  //     features: JSON.stringify([
  //       'HTML fundamentals',
  //       'CSS styling',
  //       'JavaScript basics',
  //     ]),
  //     level: 'Beginners',
  //     instructorId: instructor1.id,
  //   },
  // });

  // // Create subscriptions first
  // const subscription = await prisma.subscription.create({
  //   data: {
  //     userId: student.id,
  //     planId: 'pro',
  //     orderId: 'order_123',
  //     status: 'ACTIVE',
  //     amount: 1999,
  //     activatedAt: new Date(),
  //   },
  // });

  // // Create payment linked to subscription
  // const payment = await prisma.payment.create({
  //   data: {
  //     subscriptionId: subscription.id, // Link to subscription instead of enrollment
  //     amount: 1999,
  //     currency: 'INR',
  //     status: 'success',
  //     razorpayId: 'pay_123456',
  //   },
  // });

  // // Create enrollment with payment
  // const enrollment = await prisma.enrollment.create({
  //   data: {
  //     userId: student.id,
  //     courseId: course1.id,
  //     status: 'active',
  //     paymentId: payment.id, // Reference the payment
  //   },
  // });

  // // Create coupons
  // await prisma.coupon.create({
  //   data: {
  //     code: 'WELCOME20',
  //     discount: 20,
  //     maxUses: 100,
  //     validFrom: new Date(),
  //     validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  //     isActive: true,
  //   },
  // });

  // Create forums
  const forums = await Promise.all([
    // Computer Science Forums
    prisma.forum.create({
      data: {
        name: 'Programming Fundamentals',
        description: 'Discuss basic programming concepts, algorithms, and data structures',
        slug: 'programming-fundamentals',
      },
    }),
    prisma.forum.create({
      data: {
        name: 'Web Development',
        description: 'Topics about frontend, backend, and full-stack development',
        slug: 'web-development',
      },
    }),
    prisma.forum.create({
      data: {
        name: 'Python Programming',
        description: 'Python-specific discussions, tips, and problem-solving',
        slug: 'python-programming',
      },
    }),

    // Mathematics Forums
    prisma.forum.create({
      data: {
        name: 'Basic Mathematics',
        description: 'Arithmetic, algebra, and foundational math concepts',
        slug: 'basic-mathematics',
      },
    }),
    prisma.forum.create({
      data: {
        name: 'Advanced Mathematics',
        description: 'Calculus, linear algebra, and higher mathematics',
        slug: 'advanced-mathematics',
      },
    }),

    // Science Forums
    prisma.forum.create({
      data: {
        name: 'Physics',
        description: 'Discussions about physics concepts and problems',
        slug: 'physics',
      },
    }),
    prisma.forum.create({
      data: {
        name: 'Computer Science',
        description: 'Theory of computation, OS concepts, and computer architecture',
        slug: 'computer-science',
      },
    }),
  ]);

  // Create a demo user for topics and posts
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@cosmologic.com' },
    update: {},
    create: {
      email: 'demo@cosmologic.com',
      name: 'Demo User',
      password: 'hashed_password_here', // In real app, use proper password hashing
      role: 'ADMIN',
    },
  });

  // Create demo profile
  const demoProfile = await prisma.profile.create({
    data: {
      userId: demoUser.id,
      bio: 'Demo user for testing',
      achievements: '[]',
      skills: '[]',
      socialLinks: '{}'
    },
  });

  // Create sample topics and posts for each forum
  for (const forum of forums) {
    const topics = await Promise.all([
      prisma.topic.create({
        data: {
          title: `Welcome to ${forum.name}`,
          content: `This is the welcome topic for ${forum.name}. Please read our guidelines before posting.`,
          forumId: forum.id,
          authorId: demoUser.id,
          isPinned: true,
          posts: {
            create: {
              content: 'Welcome everyone! Feel free to ask questions and help others.',
              authorId: demoUser.id,
              profileId: demoProfile.id,
            },
          },
        },
      }),
      prisma.topic.create({
        data: {
          title: `${forum.name} Resources and Links`,
          content: `Useful resources and links for ${forum.name}`,
          forumId: forum.id,
          authorId: demoUser.id,
          posts: {
            create: {
              content: 'Here are some helpful resources to get started...',
              authorId: demoUser.id,
              profileId: demoProfile.id,
            },
          },
        },
      }),
    ]);
  }

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
