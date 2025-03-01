'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { navigationConfig } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { 
  BookOpen, Code, Compass, Gamepad2, GraduationCap, 
  Layout, Lightbulb, MessageSquare, Users, 
  BarChart, Settings, School 
} from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Layout className="mr-2 h-4 w-4" />,
    roles: ['STUDENT', 'INSTRUCTOR', 'PARENT', 'ADMIN']
  },
  {
    title: "Courses",
    href: "/courses",
    icon: <BookOpen className="mr-2 h-4 w-4" />,
    roles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    items: [
      {
        title: "Python for Kids",
        href: "/courses/python-kids",
        description: "Learn Python programming through fun games and activities",
        icon: <Code className="h-4 w-4" />,
      },
      {
        title: "Game Development",
        href: "/courses/game-dev",
        description: "Create your own games while learning to code",
        icon: <Gamepad2 className="h-4 w-4" />,
      },
      {
        title: "AI Adventures",
        href: "/courses/ai-adventures",
        description: "Explore artificial intelligence and machine learning",
        icon: <Lightbulb className="h-4 w-4" />,
      }
    ]
  },
  {
    title: "Forums",
    href: "/forums",
    icon: <MessageSquare className="mr-2 h-4 w-4" />,
    roles: ['STUDENT', 'INSTRUCTOR', 'PARENT', 'ADMIN']
  },
  {
    title: "Playground",
    href: "/playground",
    icon: <Code className="mr-2 h-4 w-4" />,
    roles: ['STUDENT', 'INSTRUCTOR', 'ADMIN']
  },
  {
    title: "Students",
    href: "/students",
    icon: <Users className="mr-2 h-4 w-4" />,
    roles: ['INSTRUCTOR', 'ADMIN']
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <BarChart className="mr-2 h-4 w-4" />,
    roles: ['INSTRUCTOR', 'PARENT', 'ADMIN']
  },
  {
    title: "Admin",
    href: "/admin",
    icon: <Settings className="mr-2 h-4 w-4" />,
    roles: ['ADMIN']
  }
];

interface NavItemsProps {
  userRole?: string;
  mobile?: boolean;
}

export function NavItems({ userRole = 'STUDENT', mobile = false }: NavItemsProps) {
  const pathname = usePathname();

  const filteredItems = navigationConfig.mainNav.filter(
    item => item.roles.includes('*') || item.roles.includes(userRole)
  );

  return (
    <nav className={cn(
      "flex gap-1",
      mobile ? "flex-col items-start" : "items-center"
    )}>
      {filteredItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          size={mobile ? 'sm' : 'default'}
          className={cn(
            "relative px-4",
            pathname === item.href && "bg-muted font-medium",
            mobile && "w-full justify-start"
          )}
          asChild
        >
          <Link href={item.href}>
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
