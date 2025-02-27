import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedUsers(prisma: PrismaClient): Promise<User[]> {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    // Admin
    {
      email: 'admin@cosmologic.academy',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
    // Instructors
    {
      email: 'sarah@cosmologic.academy',
      password: hashedPassword,
      name: 'Sarah Johnson',
      role: 'INSTRUCTOR',
      specialization: JSON.stringify(['Python', 'Web Development']),
      bio: 'Experienced web developer with 5 years of teaching experience',
      experience: 5,
    },
    // Parent
    {
      email: 'parent@example.com',
      password: hashedPassword,
      name: 'John Smith',
      role: 'PARENT',
      phone: '+1234567890',
    },
    // Students
    {
      email: 'student@example.com',
      password: hashedPassword,
      name: 'Tommy Smith',
      role: 'STUDENT',
      grade: '8th Grade',
      age: 13,
    }
  ];

  return await prisma.$transaction(
    users.map(user => 
      prisma.user.create({
        data: user
      })
    )
  );
}
