import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, ListChecks, PiggyBank, ScanLine, Settings, Tags, Target } from 'lucide-react';

export const APP_NAME = 'Fiscally Fit';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/categories', label: 'Categories', icon: Tags },
  { href: '/expenses', label: 'Expenses', icon: ListChecks },
  { href: '/budgets', label: 'Budgets', icon: Target },
  { href: '/add-receipt', label: 'Add Receipt (OCR)', icon: ScanLine },
];

export const SETTINGS_NAV_ITEM: NavItem = { href: '/settings', label: 'Settings', icon: Settings };

export const APP_LOGO_ICON = PiggyBank;

// Default categories
export const DEFAULT_CATEGORIES = [
  { id: 'cat_grocery', name: 'Grocery', icon: 'ShoppingCart' },
  { id: 'cat_transport', name: 'Transport', icon: 'Car' },
  { id: 'cat_utilities', name: 'Utilities', icon: 'Zap' },
  { id: 'cat_rent', name: 'Rent/Mortgage', icon: 'Home' },
  { id: 'cat_entertainment', name: 'Entertainment', icon: 'Film' },
  { id: 'cat_health', name: 'Health', icon: 'HeartPulse' },
  { id: 'cat_education', name: 'Education', icon: 'BookOpen' },
  { id: 'cat_other', name: 'Other', icon: 'Sparkles' },
];

// Example available icons for categories (Lucide names)
export const AVAILABLE_CATEGORY_ICONS: string[] = [
  'ShoppingCart', 'Car', 'Zap', 'Home', 'Film', 'HeartPulse', 'BookOpen', 'Sparkles',
  'Plane', 'Train', 'Bike', 'Bus', 'Shirt', 'Gift', 'Coffee', 'Pizza', 'Landmark',
  'Banknote', 'Briefcase', 'GraduationCap', 'Music', 'Gamepad2', 'Wifi', 'Phone',
  'Cable', 'Baby', 'Bone', // For Pet
];
