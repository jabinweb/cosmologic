import { Topic } from '@/lib/actions/forum'; // Adjust the import path as necessary

export interface Forum {
  id: string;
  name: string;
  slug: string;
  description: string;
  topics: Topic[];
  _count: {
    topics: number;
  };
}
