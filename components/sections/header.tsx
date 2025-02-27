"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/auth/login-dialog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Book,
  BookOpen,
  Code,
  Compass,
  Gamepad2,
  GraduationCap,
  Layout,
  Lightbulb,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";

interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
  items?: {
    title: string;
    href: string;
    description: string;
    icon?: React.ReactNode;
  }[];
}

const navigationItems: NavItem[] = [
  {
    title: "Courses",
    href: "#",
    icon: <BookOpen className="w-5 h-5" />,
    items: [
      {
        title: "Python for Kids",
        href: "/courses/python-kids",
        description: "Learn Python programming through fun games and activities",
        icon: <Code className="w-5 h-5" />,
      },
      {
        title: "Game Development",
        href: "/courses/game-dev",
        description: "Create your own games while learning to code",
        icon: <Gamepad2 className="w-5 h-5" />,
      },
      {
        title: "AI Adventures",
        href: "/courses/ai-adventures",
        description: "Explore artificial intelligence and machine learning",
        icon: <Lightbulb className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Resources",
    href: "#",
    icon: <Compass className="w-5 h-5" />,
    items: [
      {
        title: "Learning Path",
        href: "/resources/learning-path",
        description: "Structured path to become a coding expert",
        icon: <GraduationCap className="w-5 h-5" />,
      },
      {
        title: "Projects",
        href: "/resources/projects",
        description: "Hands-on projects to build your portfolio",
        icon: <Layout className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
];

export function Header() {
  const { user, signOut } = useAuth();
  const { setTheme, theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between m-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Cosmologic
            </span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger className="h-auto">
                        <span className="flex items-center gap-2">
                          {item.icon}
                          {item.title}
                        </span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                          {item.items.map((subItem) => (
                            <li key={subItem.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={subItem.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="flex items-center gap-2">
                                    {subItem.icon}
                                    <span className="text-sm font-medium">{subItem.title}</span>
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {subItem.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink
                      href={item.href}
                      className={cn(navigationMenuTriggerStyle(), "h-auto")}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <User className="h-5 w-5 mr-2" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <Layout className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <LoginDialog mode="login" trigger={<Button variant="ghost">Log in</Button>} />
              <LoginDialog mode="register" trigger={<Button>Register</Button>} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}