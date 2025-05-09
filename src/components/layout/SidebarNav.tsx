
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, SETTINGS_NAV_ITEM } from '@/lib/constants';
import type { NavItem } from '@/lib/constants';
import { FiscallyFitLogo } from '@/components/FiscallyFitLogo';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from '../ui/separator';
import { t } from '@/lib/i18n';

export function SidebarNav() {
  const pathname = usePathname();

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
    const label = t(`nav.${item.labelKey}`);
    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          className={cn(
            "w-full justify-start text-sm font-medium",
            isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          )}
          tooltip={{content: label}}
        >
          <Link href={item.href} className="flex items-center">
            <item.icon className={cn("h-5 w-5 mr-3 shrink-0", isActive ? "text-primary" : "")} />
            <span className="truncate">{label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r">
      <SidebarHeader className="p-4 border-b">
         <FiscallyFitLogo iconProps={{className: "text-primary h-7 w-7"}} className="group-data-[collapsible=icon]:hidden"/>
         <FiscallyFitLogo iconProps={{className: "text-primary h-7 w-7"}} hideText={true} className="hidden group-data-[collapsible=icon]:flex justify-center"/>
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {NAV_ITEMS.map(renderNavItem)}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t">
         <Separator className="my-2 group-data-[collapsible=icon]:hidden" />
         {renderNavItem(SETTINGS_NAV_ITEM)}
      </SidebarFooter>
    </Sidebar>
  );
}
