"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  CreditCard,
  BookOpen,
  Settings,
  BarChart,
  LogOut,
  BadgeDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Plans",
    href: "/admin/plans",
    icon: BadgeDollarSign,
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col border-r px-4 py-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>

      <Button
        variant="ghost"
        className="flex items-center gap-3 w-full justify-start"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}
