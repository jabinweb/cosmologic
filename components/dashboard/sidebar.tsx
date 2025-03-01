"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Layout,
  LineChart,
  Menu,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";

interface SidebarLink {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const sidebarLinks: SidebarLink[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <Layout className="mr-2 h-4 w-4" />,
    roles: ["STUDENT", "INSTRUCTOR", "ADMIN"],
  },
  {
    title: "My Courses",
    href: "/dashboard/my-courses",
    icon: <BookOpen className="mr-2 h-4 w-4" />,
    roles: ["STUDENT"],
  },
  {
    title: "Manage Courses",
    href: "/dashboard/courses/manage",
    icon: <GraduationCap className="mr-2 h-4 w-4" />,
    roles: ["INSTRUCTOR"],
  },
  {
    title: "Progress",
    href: "/dashboard/progress",
    icon: <LineChart className="mr-2 h-4 w-4" />,
    roles: ["STUDENT"],
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: <Users className="mr-2 h-4 w-4" />,
    roles: ["INSTRUCTOR", "ADMIN"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
    roles: ["STUDENT", "INSTRUCTOR", "ADMIN"],
  },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const filteredLinks = sidebarLinks.filter((link) =>
    link.roles.includes(user?.role || "")
  );

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
          <div className="space-y-1">
            {filteredLinks.map((link) => (
              <Button
                key={link.href}
                variant={pathname === link.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === link.href && "bg-purple-50 dark:bg-gray-700"
                )}
                asChild
              >
                <Link href={link.href}>
                  {link.icon}
                  {link.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="ml-2 mt-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <Sidebar className="hidden lg:block" />
    </>
  );
}
