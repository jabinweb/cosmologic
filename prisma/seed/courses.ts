import { PrismaClient, User } from '@prisma/client';

export async function seedCourses(prisma: PrismaClient, users: User[]) {
  const instructor = users.find(user => user.role === 'INSTRUCTOR');
  
  if (!instructor) {
    throw new Error('No instructor found for courses');
  }

  const courses = [
    {
      name: 'Python for Kids',
      description: 'A fun introduction to Python programming with games and animations',
      price: 1999.00,
      features: JSON.stringify([
        'Game-based learning',
        'Interactive exercises',
        'Visual programming concepts',
        'Basic Python syntax',
        'Simple project creation'
      ]),
      level: 'beginner',
      instructorId: instructor.id,
    },
    {
      name: 'Web Development Basics',
      description: 'Learn to create your own websites with HTML, CSS, and JavaScript',
      price: 2499.00,
      features: JSON.stringify([
        'HTML5 fundamentals',
        'CSS styling techniques',
        'JavaScript basics',
        'Responsive design',
        'Project portfolio'
      ]),
      level: 'beginner',
      instructorId: instructor.id,
    },
    {
      name: 'Scratch Programming',
      description: 'Visual block-based programming perfect for young beginners',
      price: 1499.00,
      features: JSON.stringify([
        'Block-based coding',
        'Animation creation',
        'Game development',
        'Problem-solving skills',
        'Creative thinking'
      ]),
      level: 'beginner',
      instructorId: instructor.id,
    },
    {
      name: 'Advanced Python',
      description: 'Take your Python skills to the next level with advanced concepts',
      price: 3999.00,
      features: JSON.stringify([
        'Object-oriented programming',
        'Data structures',
        'File handling',
        'API integration',
        'Database basics'
      ]),
      level: 'intermediate',
      instructorId: instructor.id,
    },
    {
      name: 'Mobile App Development',
      description: 'Create mobile apps using React Native',
      price: 4999.00,
      features: JSON.stringify([
        'React Native basics',
        'Mobile UI design',
        'State management',
        'API integration',
        'App deployment'
      ]),
      level: 'intermediate',
      instructorId: instructor.id,
    },
    {
      name: 'Robotics for Kids',
      description: 'Hands-on robotics learning with Arduino',
      price: 5999.00,
      features: JSON.stringify([
        'Arduino programming',
        'Electronics basics',
        'Sensor integration',
        'Robot building',
        'Project showcase'
      ]),
      level: 'intermediate',
      instructorId: instructor.id,
    }
  ];

  return await prisma.course.createMany({
    data: courses,
    skipDuplicates: true,
  }).then(() => prisma.course.findMany());
}
