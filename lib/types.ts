export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'PARENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface StudentProfile extends User {
  parentId?: string;
  grade?: string;
  age?: number;
}

export interface ParentProfile extends User {
  children?: StudentProfile[];
  phone: string;
}

export interface InstructorProfile extends User {
  specialization: string[];
  bio?: string;
  experience?: number;
}
