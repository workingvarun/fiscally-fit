import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, ListChecks, PiggyBank, ScanLine, Settings, Tags, Target } from 'lucide-react';
import { t } from './i18n'; // Import t for default category names

export interface NavItem {
  href: string;
  labelKey: keyof AppTranslations['nav']; // Use keys from i18n nav section
  icon: LucideIcon;
}

// NAV_ITEMS now store keys, translation will happen in the component
export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/categories', labelKey: 'categories', icon: Tags },
  { href: '/expenses', labelKey: 'expenses', icon: ListChecks },
  { href: '/budgets', labelKey: 'budgets', icon: Target },
  { href: '/add-receipt', labelKey: 'addReceipt', icon: ScanLine },
];

export const SETTINGS_NAV_ITEM: NavItem = { href: '/settings', labelKey: 'settings', icon: Settings };

export const APP_LOGO_ICON = PiggyBank;

// Default categories: name is now a translation key
export const DEFAULT_CATEGORIES = [
  { id: 'cat_grocery', nameKey: 'defaultCategories.grocery', icon: 'ShoppingCart' },
  { id: 'cat_transport', nameKey: 'defaultCategories.transport', icon: 'Car' },
  { id: 'cat_utilities', nameKey: 'defaultCategories.utilities', icon: 'Zap' },
  { id: 'cat_rent', nameKey: 'defaultCategories.rentMortgage', icon: 'Home' },
  { id: 'cat_entertainment', nameKey: 'defaultCategories.entertainment', icon: 'Film' },
  { id: 'cat_health', nameKey: 'defaultCategories.health', icon: 'HeartPulse' },
  { id: 'cat_education', nameKey: 'defaultCategories.education', icon: 'BookOpen' },
  { id: 'cat_other', nameKey: 'defaultCategories.other', icon: 'Sparkles' },
].map(cat => ({...cat, name: t(cat.nameKey)})); // Translate names upon initialization for convenience if used directly
// If categories are fetched/set dynamically, translation should happen at display time.
// For this app structure, pre-translating here for localStorage is okay.

// Example available icons for categories (Lucide names)
export const AVAILABLE_CATEGORY_ICONS: string[] = [
  'ShoppingCart', 'Car', 'Zap', 'Home', 'Film', 'HeartPulse', 'BookOpen', 'Sparkles',
  'Plane', 'Train', 'Bike', 'Bus', 'Shirt', 'Gift', 'Coffee', 'Pizza', 'Landmark',
  'Banknote', 'Briefcase', 'GraduationCap', 'Music', 'Gamepad2', 'Wifi', 'Phone',
  'Cable', 'Baby', 'Bone', // For Pet
];

// Import AppTranslations type for NavItem labelKey
import type { AppTranslations } from './i18n';
