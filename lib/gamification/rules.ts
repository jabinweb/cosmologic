export interface Rule {
  id: string;
  name: string;
  description: string;
  points: number;
  condition: (data: any) => boolean;
  rewards: {
    type: 'achievement' | 'badge' | 'points';
    value: string | number;
  }[];
}

export const gamificationRules: Rule[] = [
  {
    id: 'first_perfect_score',
    name: 'Perfect Start',
    description: 'Get 100% on your first attempt',
    points: 100,
    condition: (data) => data.score === 100 && data.attempts === 1,
    rewards: [
      { type: 'achievement', value: 'perfect_start' },
      { type: 'points', value: 100 }
    ]
  },
  {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: 'Complete a module in under 30 minutes',
    points: 50,
    condition: (data) => data.completionTime < 1800,
    rewards: [
      { type: 'badge', value: 'quick_learner' },
      { type: 'points', value: 50 }
    ]
  },
  // Add more rules as needed
];

export function evaluateRules(context: any) {
  return gamificationRules
    .filter(rule => rule.condition(context))
    .map(rule => ({
      rule: rule.id,
      rewards: rule.rewards
    }));
}
