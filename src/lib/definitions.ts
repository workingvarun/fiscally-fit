export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name as string
  userId?: string; // Optional: for future multi-user support
}

export interface GroceryItem {
  id: string;
  name: string;
  price: number;
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string; // ISO string format for date
  notes?: string;
  items?: GroceryItem[]; // For itemized grocery expenses
  userId?: string; // Optional
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  monthYear: string; // "YYYY-MM" format
  userId?: string; // Optional
}

export type SpendingByCategory = {
  categoryName: string;
  icon: string;
  totalSpent: number;
  budgetAmount?: number;
};

export type Theme = "light" | "dark" | "system";
