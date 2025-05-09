// src/lib/i18n.ts
export type Locale = 'en-US'; // Add more locales as needed

export interface AppTranslations {
  // General App
  appName: string;
  appDescription: string;

  // Navigation
  nav: {
    dashboard: string;
    categories: string;
    expenses: string;
    budgets: string;
    addReceipt: string;
    settings: string;
  };

  // Currency
  currency: {
    symbol: string; // e.g., '$', '€', '£'
  };

  // Common UI Elements
  common: {
    add: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    amount: string;
    category: string;
    date: string;
    notes: string;
    total: string;
    error: string;
    success: string;
    loading: string;
    processing: string;
    selectPlaceholder: (item: string) => string;
    noItems: string;
    noData: string;
    confirmAction: string;
    areYouSure: string;
    actionCannotBeUndone: string;
    dataCleared: string;
    allDataRemoved: string;
    selected: string;
    price: string;
    itemName: string;
  };

  // Page Specific: Dashboard
  pageDashboard: {
    title: string;
    description: string;
    totalSpendingThisMonth: string;
    budgetUtilization: string;
    topSpendingCategory: string;
    spendingByCategory: string;
    visualBreakdownExpenses: string;
    budgetProgress: string;
    trackBudgetGoals: string;
    importantNotice: string;
    demoNotice: string;
    categorySpendingChartComingSoon: string;
    budgetProgressBarsComingSoon: string;
  };

  // Page Specific: Add Receipt
  pageAddReceipt: {
    title: string;
    description: string;
    uploadReceipt: string;
    selectReceiptImage: string;
    uploadAFile: string;
    orDragAndDrop: string;
    fileFormatHint: string;
    selectedFile: (fileName: string, fileSizeKB: string) => string;
    extractData: string;
    reviewEditExtractedItems: string;
    verifyExtractedItems: string;
    extractedItemsWillAppearHere: string;
    extractingItems: string;
    uploadReceiptToSeeResults: string;
    noItemsExtractedOrNotPerformed: string;
    tryClearerImage: string;
    unnamedItem: string;
    saveAsGroceryExpense: string;
    ocrTips: string;
    ocrTipClearImages: string;
    ocrTipFlatReceipt: string;
    ocrTipNoShadows: string;
    ocrTipStandardReceipts: string;
    pleaseSelectReceiptImage: string;
    ocrFailed: (errorMessage: string) => string;
    ocrErrorUnknown: string;
    dataExtractedReview: string;
    noItemsToSave: string;
    groceryCategoryNotFound: string;
    expenseSavedSuccess: string;
  };
  
  // Page Specific: Budgets
  pageBudgets: {
    title: string;
    description: string;
    setBudget: string;
    editBudget: string;
    viewBudgetsFor: string;
    selectMonthYear: string;
    noBudgetsSetForMonth: (monthYear: string) => string;
    createBudgetsToTrackGoals: string;
    budgetForMonthYear: (monthYear: string) => string;
    budgetAmountForMonthYear: (monthYear: string, amount: string) => string;
    spent: string;
    remaining: string;
    overBy: (amount: string) => string;
    setNewBudgetDialogTitle: string;
    editBudgetDialogTitle: string;
    setSpendingGoalForCategory: string;
    updateBudgetDetails: string;
    amountCategoryMonthRequired: string;
    budgetExistsError: (categoryName: string, monthYear: string) => string;
    budgetSetSuccess: string;
    budgetUpdatedSuccess: string;
    budgetDeletedSuccess: string;
  };

  // Page Specific: Categories
  pageCategories: {
    title: string;
    description: string;
    addCategory: string;
    editCategoryDialogTitle: string;
    addCategoryDialogTitle: string;
    noCategoriesYet: string;
    startAddingFirstCategory: string;
    categoryName: string;
    icon: string;
    selectIconForCategory: string;
    categoryNameIconRequired: string;
    categoryAddedSuccess: string;
    categoryUpdatedSuccess: string;
    categoryDeletedSuccess: string;
    trackExpensesFor: (categoryName: string) => string;
    updateCategoryDetails: string;
    createNewCategoryToTrackSpending: string;
  };

  // Page Specific: Expenses
  pageExpenses: {
    title: string;
    description: string;
    addExpense: string;
    editExpenseDialogTitle: string;
    addExpenseDialogTitle: string;
    noExpensesYet: string;
    startAddingFirstExpense: string;
    recordNewExpenseTransaction: string;
    updateExpenseDetails: string;
    amountCategoryDateRequired: string;
    itemNamePriceRequired: string;
    expenseAddedSuccess: string;
    expenseUpdatedSuccess: string;
    expenseDeletedSuccess: string;
    groceryItems: string;
    addItem: string;
    totalAmount: (amount: string) => string;
  };

  // Page Specific: Settings
  pageSettings: {
    title: string;
    description: string;
    appearance: string;
    customizeLookFeel: string;
    darkMode: string;
    toggleDarkLight: string;
    notifications: string;
    manageNotificationPrefs: string;
    budgetAlerts: string;
    receiveBudgetAlerts: string;
    notificationSettingsNotFunctional: string;
    dataPrivacy: string;
    manageAppData: string;
    exportDataComingSoon: string;
    clearAllLocalData: string;
    dataStorageNote: string;
  };

  // Default Categories (used in constants.ts and categories page)
  defaultCategories: {
    grocery: string;
    transport: string;
    utilities: string;
    rentMortgage: string;
    entertainment: string;
    health: string;
    education: string;
    other: string;
  };

  // Toasts
  toast: {
    errorTitle: string;
    successTitle: string;
    infoTitle: string;
  }
}

const EN_US_TRANSLATIONS: AppTranslations = {
  appName: 'Fiscally Fit',
  appDescription: 'Your personal budgeting and expense tracking companion.',
  nav: {
    dashboard: 'Dashboard',
    categories: 'Categories',
    expenses: 'Expenses',
    budgets: 'Budgets',
    addReceipt: 'Add Receipt (OCR)',
    settings: 'Settings',
  },
  currency: {
    symbol: '$',
  },
  common: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    amount: 'Amount',
    category: 'Category',
    date: 'Date',
    notes: 'Notes',
    total: 'Total',
    error: 'Error',
    success: 'Success',
    loading: 'Loading...',
    processing: 'Processing...',
    selectPlaceholder: (item: string) => `Select a ${item.toLowerCase()}`,
    noItems: 'No items',
    noData: 'No data to display.',
    confirmAction: 'Confirm Action',
    areYouSure: 'Are you sure?',
    actionCannotBeUndone: 'This action cannot be undone.',
    dataCleared: 'Data Cleared',
    allDataRemoved: 'All application data has been removed from local storage.',
    selected: 'Selected',
    price: "Price",
    itemName: "Item Name",
  },
  pageDashboard: {
    title: 'Dashboard',
    description: 'Your financial overview at a glance.',
    totalSpendingThisMonth: 'Total Spending This Month',
    budgetUtilization: 'Budget Utilization',
    topSpendingCategory: 'Top Spending Category',
    spendingByCategory: 'Spending by Category',
    visualBreakdownExpenses: 'Visual breakdown of your expenses.',
    budgetProgress: 'Budget Progress',
    trackBudgetGoals: 'Track your progress towards budget goals.',
    importantNotice: 'Important Notice',
    demoNotice: 'This is a demo application. OCR functionality and full data persistence are illustrative. Data entered is stored locally in your browser.',
    categorySpendingChartComingSoon: 'Category Spending Chart Coming Soon',
    budgetProgressBarsComingSoon: 'Budget Progress Bars Coming Soon',
  },
  pageAddReceipt: {
    title: 'Add Grocery Receipt',
    description: 'Upload a receipt image to automatically extract items and prices using OCR.',
    uploadReceipt: '1. Upload Receipt',
    selectReceiptImage: 'Select Receipt Image',
    uploadAFile: 'Upload a file',
    orDragAndDrop: 'or drag and drop',
    fileFormatHint: 'PNG, JPG, GIF up to 10MB',
    selectedFile: (fileName: string, fileSizeKB: string) => `Selected: ${fileName} (${fileSizeKB} KB)`,
    extractData: 'Extract Data',
    reviewEditExtractedItems: '2. Review & Edit Extracted Items',
    verifyExtractedItems: 'Verify the extracted items and make corrections if needed.',
    extractedItemsWillAppearHere: 'Extracted items will appear here.',
    extractingItems: 'Extracting items...',
    uploadReceiptToSeeResults: 'Upload a receipt image and click "Extract Data" to see results.',
    noItemsExtractedOrNotPerformed: 'No items extracted, or extraction not yet performed.',
    tryClearerImage: 'If extraction failed, try a clearer image or different lighting.',
    unnamedItem: 'Unnamed Item',
    saveAsGroceryExpense: 'Save as Grocery Expense',
    ocrTips: 'OCR Tips',
    ocrTipClearImages: 'Use clear, well-lit images of your receipts.',
    ocrTipFlatReceipt: 'Ensure the receipt is flat and not crumpled.',
    ocrTipNoShadows: 'Avoid shadows or glare on the receipt.',
    ocrTipStandardReceipts: 'The OCR is optimized for standard grocery receipts. Complex layouts might have lower accuracy.',
    pleaseSelectReceiptImage: 'Please select a receipt image.',
    ocrFailed: (errorMessage: string) => `Could not extract data: ${errorMessage}. Please try again or enter manually.`,
    ocrErrorUnknown: 'Unknown error',
    dataExtractedReview: 'Data extracted. Please review and edit if necessary.',
    noItemsToSave: 'No items to save as an expense.',
    groceryCategoryNotFound: 'Grocery category not found. Please create one.',
    expenseSavedSuccess: 'Grocery expense saved successfully!',
  },
  pageBudgets: {
    title: 'Budgets',
    description: 'Set and track your monthly spending goals.',
    setBudget: 'Set Budget',
    editBudget: 'Edit Budget',
    viewBudgetsFor: 'View Budgets For:',
    selectMonthYear: 'Select month/year',
    noBudgetsSetForMonth: (monthYear: string) => `No Budgets Set for ${monthYear}`,
    createBudgetsToTrackGoals: 'Create budgets to start tracking your goals.',
    budgetForMonthYear: (monthYear: string) => `Budget for ${monthYear}`,
    budgetAmountForMonthYear: (monthYear: string, amount: string) => `Budget for ${monthYear}: ${amount}`,
    amount: 'Amount',
    spent: 'Spent',
    remaining: 'Remaining',
    overBy: (amount: string) => `Over by ${amount}`,
    setNewBudgetDialogTitle: 'Set New Budget',
    editBudgetDialogTitle: 'Edit Budget',
    setSpendingGoalForCategory: 'Set a spending goal for a category.',
    updateBudgetDetails: 'Update budget details.',
    amountCategoryMonthRequired: 'Amount, category, and month/year are required.',
    budgetExistsError: (categoryName: string, monthYear: string) => `A budget for ${categoryName} for ${monthYear} already exists. Edit it instead.`,
    budgetSetSuccess: 'Budget set successfully.',
    budgetUpdatedSuccess: 'Budget updated successfully.',
    budgetDeletedSuccess: 'Budget deleted successfully.',
  },
  pageCategories: {
    title: 'Spending Categories',
    description: 'Manage your expense categories.',
    addCategory: 'Add Category',
    editCategoryDialogTitle: 'Edit Category',
    addCategoryDialogTitle: 'Add New Category',
    noCategoriesYet: 'No Categories Yet',
    startAddingFirstCategory: 'Start by adding your first spending category.',
    categoryName: 'Name',
    icon: 'Icon',
    selectIconForCategory: 'Select an icon for your category.',
    categoryNameIconRequired: 'Category name and icon are required.',
    categoryAddedSuccess: 'Category added successfully.',
    categoryUpdatedSuccess: 'Category updated successfully.',
    categoryDeletedSuccess: 'Category deleted successfully.',
    trackExpensesFor: (categoryName: string) => `Track expenses for ${categoryName.toLowerCase()}.`,
    updateCategoryDetails: 'Update the details for this category.',
    createNewCategoryToTrackSpending: 'Create a new category to track your spending.',
  },
  pageExpenses: {
    title: 'Expenses',
    description: 'Track and manage your spending.',
    addExpense: 'Add Expense',
    editExpenseDialogTitle: 'Edit Expense',
    addExpenseDialogTitle: 'Add New Expense',
    noExpensesYet: 'No Expenses Yet',
    startAddingFirstExpense: 'Start by adding your first expense entry.',
    recordNewExpenseTransaction: 'Record a new expense transaction.',
    updateExpenseDetails: 'Update the details for this expense.',
    amountCategoryDateRequired: 'Amount, category, and date are required.',
    itemNamePriceRequired: 'Item name and valid price are required.',
    expenseAddedSuccess: 'Expense added successfully.',
    expenseUpdatedSuccess: 'Expense updated successfully.',
    expenseDeletedSuccess: 'Expense deleted successfully.',
    groceryItems: 'Grocery Items',
    addItem: 'Add',
    totalAmount: (amount: string) => `Total: ${amount}`,
  },
  pageSettings: {
    title: 'Settings',
    description: 'Manage your application preferences and data.',
    appearance: 'Appearance',
    customizeLookFeel: 'Customize the look and feel of the app.',
    darkMode: 'Dark Mode',
    toggleDarkLight: 'Toggle between light and dark themes.',
    notifications: 'Notifications',
    manageNotificationPrefs: 'Manage your notification preferences.',
    budgetAlerts: 'Budget Alerts',
    receiveBudgetAlerts: 'Receive alerts for budget milestones.',
    notificationSettingsNotFunctional: 'Notification settings are illustrative and not functional in this demo.',
    dataPrivacy: 'Data & Privacy',
    manageAppData: 'Manage your application data.',
    exportDataComingSoon: 'Export Data (Coming Soon)',
    clearAllLocalData: 'Clear All Local Data',
    dataStorageNote: 'This application stores data in your browser\'s local storage. Clearing data will remove all categories, expenses, and budgets.',
  },
  defaultCategories: {
    grocery: 'Grocery',
    transport: 'Transport',
    utilities: 'Utilities',
    rentMortgage: 'Rent/Mortgage',
    entertainment: 'Entertainment',
    health: 'Health',
    education: 'Education',
    other: 'Other',
  },
  toast: {
    errorTitle: 'Error',
    successTitle: 'Success',
    infoTitle: 'Info',
  }
};

const translations: Record<Locale, AppTranslations> = {
  'en-US': EN_US_TRANSLATIONS,
};

const CURRENT_LOCALE: Locale = 'en-US'; // For simplicity, hardcode. Could be dynamic.

// Helper function to get nested keys
function getNestedTranslation(keys: string[], langObj: any): string | Function | undefined {
  let current = langObj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined; // Key path not found
    }
  }
  return current as string | Function | undefined;
}

export function t(path: string, ...args: any[]): string {
  const keys = path.split('.');
  const translation = getNestedTranslation(keys, translations[CURRENT_LOCALE]);

  if (typeof translation === 'function') {
    return (translation as (...args: any[]) => string)(...args);
  }
  if (typeof translation === 'string') {
    return translation;
  }
  // Fallback for keys that might not be nested, e.g. appName directly
  if (keys.length === 1 && translations[CURRENT_LOCALE].hasOwnProperty(keys[0])) {
      const directTranslation = (translations[CURRENT_LOCALE] as any)[keys[0]];
      if (typeof directTranslation === 'string') return directTranslation;
  }
  return path; // Fallback to key path if translation not found
}

export function formatCurrency(amount: number, locale: Locale = CURRENT_LOCALE): string {
  const symbol = translations[locale].currency.symbol;
  // Basic formatting, can be expanded with Intl.NumberFormat for more complex needs
  // For example: new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(amount);
  // But this requires knowing the currency code (e.g., 'USD'). For now, just symbol and toFixed(2).
  const formattedAmount = amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formattedAmount}`;
}

export function getCurrencySymbol(locale: Locale = CURRENT_LOCALE): string {
  return translations[locale].currency.symbol;
}
