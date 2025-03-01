"use client";

import Link from "next/link";
import { NavMenu } from "./nav-menu";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/providers/auth-provider";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between m-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Cosmologic
            </span>
          </Link>
          <div className="hidden md:block">
            <NavMenu />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu />
          {user && <MobileNav className="md:hidden" />}
        </div>
      </div>
    </header>
  );
}