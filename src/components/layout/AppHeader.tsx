
"use client";

import Link from 'next/link';
import { FiscallyFitLogo } from '@/components/FiscallyFitLogo';
import { Button } from '@/components/ui/button';
// Sheet components are not used here currently, but kept if mobile nav uses it later
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { Menu } from 'lucide-react'; // Menu icon not used if SidebarTrigger handles mobile
import { Moon, Sun } from 'lucide-react';
import type { NavItem } from '@/lib/constants'; // NAV_ITEMS and SETTINGS_NAV_ITEM are not directly used here for labels
import { useTheme } from 'next-themes';
import {
  SidebarTrigger
} from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';
// import { t } from '@/lib/i18n'; // Not needed here as labels come from SidebarNav which uses t

export function AppHeader() {
  const { theme, setTheme } = useTheme();

  // renderNavLink is not used in current AppHeader structure, SidebarNav handles links
  // const renderNavLink = (item: NavItem, isMobile: boolean = false) => (
  //   <Button
  //     key={item.href}
  //     variant="ghost"
  //     asChild
  //     className={cn(
  //       "justify-start text-foreground/80 hover:text-foreground hover:bg-accent/50",
  //       isMobile ? "w-full text-base py-3" : "text-sm"
  //     )}
  //   >
  //     <Link href={item.href}>
  //       <item.icon className="mr-2 h-5 w-5" />
  //       {t(`nav.${item.labelKey}`)}
  //     </Link>
  //   </Button>
  // );

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
