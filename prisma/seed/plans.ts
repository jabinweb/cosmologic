import { PrismaClient, Plan } from '@prisma/client';

export async function seedPlans(prisma: PrismaClient): Promise<Plan[]> {
  const plans = [
    // Online Plans
    {
      type: 'basic',
      name: 'basic',
      displayName: 'Basic Plan',
      description: 'Perfect for beginners starting their coding journey',
      price: 149900, // ₹1,499
      features: JSON.stringify([
        '4 Live Classes per month',
        'Basic coding exercises',
        'Community support',
        'Course materials'
      ]),
      perks: JSON.stringify([
        'Certificate of completion',
        'Discord community access',
        'Email support'
      ]),
      isFeatured: false,
      isActive: true,
      color: 'bg-blue-500',
      order: 1
    },
    {
      type: 'pro',
      name: 'pro',
      displayName: 'Pro Plan',
      description: 'Most popular choice for serious learners',
      price: 249900, // ₹2,499
      features: JSON.stringify([
        '8 Live Classes per month',
        'Advanced coding projects',
        'Priority community support',
        'Premium course materials',
        'Personal mentor'
      ]),
      perks: JSON.stringify([
        'Pro certificate',
        'Discord premium access',
        '24/7 support',
        'Project reviews'
      ]),
      isFeatured: true,
      isActive: true,
      color: 'bg-purple-500',
      order: 2
    },
    {
      type: 'premium',
      name: 'premium',
      displayName: 'Premium Plan',
      description: 'Ultimate learning experience with personal mentoring',
      price: 399900, // ₹3,999
      features: JSON.stringify([
        'Unlimited Live Classes',
        'Expert mentorship',
        'Custom learning path',
        'Real-world projects',
        'Job placement assistance'
      ]),
      perks: JSON.stringify([
        'Premium certificate',
        'One-on-one mentoring',
        'Career guidance',
        'Interview preparation'
      ]),
      isFeatured: false,
      isActive: true,
      color: 'bg-amber-500',
      order: 3
    },
    // Offline Plans
    {
      type: 'basic',
      name: 'basic',
      displayName: 'Basic Classroom',
      description: 'Start your coding journey in our classroom',
      price: 299900, // ₹2,999
      features: JSON.stringify([
        '8 Classroom sessions per month',
        'Basic coding exercises',
        'In-person support',
        'Physical study materials'
      ]),
      perks: JSON.stringify([
        'Classroom certificate',
        'Study materials',
        'Practice sessions'
      ]),
      isFeatured: false,
      isActive: true,
      color: 'bg-blue-500',
      order: 1
    },
    {
      type: 'pro',
      name: 'pro',
      displayName: 'Pro Classroom',
      description: 'Intensive classroom learning experience',
      price: 499900, // ₹4,999
      features: JSON.stringify([
        '12 Classroom sessions per month',
        'Advanced projects',
        'Dedicated instructor',
        'Premium study materials',
        'Lab access'
      ]),
      perks: JSON.stringify([
        'Pro classroom certificate',
        'Lab facility access',
        'Weekend workshops',
        'Project guidance'
      ]),
      isFeatured: true,
      isActive: true,
      color: 'bg-purple-500',
      order: 2
    },
    {
      type: 'premium',
      name: 'premium',
      displayName: 'Premium Classroom',
      description: 'Complete immersive learning experience',
      price: 799900, // ₹7,999
      features: JSON.stringify([
        'Unlimited classroom access',
        'Personal instructor',
        'Custom curriculum',
        'Industry projects',
        'Placement support'
      ]),
      perks: JSON.stringify([
        'Premium classroom certificate',
        'Dedicated mentor',
        'Industry visits',
        'Internship opportunities'
      ]),
      isFeatured: false,
      isActive: true,
      color: 'bg-amber-500',
      order: 3
    }
  ];

  return await prisma.plan.createMany({
    data: plans,
    skipDuplicates: true,
  }).then(() => prisma.plan.findMany());
}
