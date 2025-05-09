"use client";

import Link from 'next/link';
import { FiscallyFitLogo } from '@/components/FiscallyFitLogo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun } from 'lucide-react';
import { NAV_ITEMS, SETTINGS_NAV_ITEM } from '@/lib/constants';
import type { NavItem } from '@/lib/constants';
import { useTheme } from 'next-themes';
import {
  SidebarTrigger
} from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';


export function AppHeader() {
  const { theme, setTheme } = useTheme();

  const renderNavLink = (item: NavItem, isMobile: boolean = false) => (
    <Button
      key={item.href}
      variant="ghost"
      asChild
      className={cn(
        "justify-start text-foreground/80 hover:text-foreground hover:bg-accent/50",
        isMobile ? "w-full text-base py-3" : "text-sm"
      )}
    >
      <Link href={item.href}>
        <item.icon className="mr-2 h-5 w-5" />
        {item.label}
      </Link>
    </Button>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
             <SidebarTrigger />
          </div>
          <Link href="/dashboard" aria-label="Go to dashboard">
            <FiscallyFitLogo iconProps={{ className: "h-8 w-8" }} />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={theme === 'light' ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
