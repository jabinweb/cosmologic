export const navigationConfig = {
  mainNav: [
    {
      title: 'Home',
      href: '/',
      roles: ['*']
    },
    {
      title: 'Dashboard',
      href: '/dashboard',
      roles: ['STUDENT', 'INSTRUCTOR', 'PARENT', 'ADMIN']
    },
    {
      title: 'Courses',
      href: '/courses',
      roles: ['STUDENT', 'INSTRUCTOR', 'PARENT', 'ADMIN']
    },
    {
      title: 'Forums',
      href: '/forums',
      roles: ['STUDENT', 'INSTRUCTOR', 'PARENT', 'ADMIN']
    },
    {
      title: 'Playground',
      href: '/playground',
      roles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    },
    {
      title: 'Students',
      href: '/students',
      roles: ['INSTRUCTOR', 'ADMIN']
    },
    {
      title: 'Reports',
      href: '/reports',
      roles: ['INSTRUCTOR', 'PARENT', 'ADMIN']
    }
  ]
};
