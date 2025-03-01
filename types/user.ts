import { Role } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  isAdmin?: boolean;
}

export interface UserProfile extends User {
  parentId?: string;
  specialization: string;
  bio?: string;
  experience?: number;
  phone?: string;
  grade?: string;
  age?: number;
  emailVerified?: Date;
}
