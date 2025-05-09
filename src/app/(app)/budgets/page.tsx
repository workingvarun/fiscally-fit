
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Edit3, Trash2, Target, DollarSign } from "lucide-react";
import type { Budget, Category, Expense } from "@/lib/definitions";
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_CATEGORIES } from '@/lib/constants';
import { format, getMonth, getYear, setMonth, setYear, parse } from 'date-fns';
import * as LucideIcons from 'lucide-react';
import { t, formatCurrency } from '@/lib/i18n';

const iconMap: { [key: string]: LucideIcons.LucideIcon } = { ...LucideIcons };
const CategoryIcon = ({ name, ...props }: { name: string } & React.ComponentProps<LucideIcons.LucideIcon>) => {
  const IconComponent = iconMap[name] || LucideIcons.Sparkles;
  return <IconComponent {...props} />;
};

const getCurrentMonthYear = () => format(new Date(), "yyyy-MM");

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  
  const [amount, setAmount] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [monthYear, setMonthYear] = useState<string>(getCurrentMonthYear());

  const { toast } = useToast();

  useEffect(() => {
    const storedBudgets = localStorage.getItem('fiscallyFitBudgets');
    if (storedBudgets) setBudgets(JSON.parse(storedBudgets));

    const storedCategories = localStorage.getItem('fiscallyFitCategories');
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    else setCategories(DEFAULT_CATEGORIES); // Names are pre-translated in constants

    const storedExpenses = localStorage.getItem('fiscallyFitExpenses');
    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
  }, []);

  const saveBudgets = (updatedBudgets: Budget[]) => {
    setBudgets(updatedBudgets);
    localStorage.setItem('fiscallyFitBudgets', JSON.stringify(updatedBudgets));
  };

  const formatMonthYearForDisplay = (my: string) => {
    try {
      const parsedDate = parse(my, "yyyy-MM", new Date());
      return format(parsedDate, "MMMM yyyy");
    } catch (e) {
      return my; // Fallback if parsing fails
    }
  };
  
  const handleFormSubmit = () => {
    if (!amount.trim() || parseFloat(amount) <= 0 || !selectedCategoryId || !monthYear) {
      toast({ title: t('toast.errorTitle'), description: t('pageBudgets.amountCategoryMonthRequired'), variant: "destructive" });
      return;
    }

    const existing = !editingBudget && budgets.find(b => b.categoryId === selectedCategoryId && b.monthYear === monthYear);
    if (existing) {
      toast({ 
        title: t('toast.errorTitle'), 
        description: t('pageBudgets.budgetExistsError', getCategoryName(selectedCategoryId), formatMonthYearForDisplay(monthYear)), 
        variant: "destructive", 
        duration: 5000 
      });
      return;
    }

    const budgetData: Partial<Budget> = {
      amount: parseFloat(amount),
      categoryId: selectedCategoryId,
      monthYear: monthYear,
    };

    if (editingBudget) {
      const updatedBudgets = budgets.map(b =>
        b.id === editingBudget.id ? { ...b, ...budgetData } as Budget : b
      );
      saveBudgets(updatedBudgets);
      toast({ title: t('toast.successTitle'), description: t('pageBudgets.budgetUpdatedSuccess') });
    } else {
      const newBudget: Budget = {
        id: `bud_${Date.now()}`,
        ...budgetData
      } as Budget;
      saveBudgets([...budgets, newBudget]);
      toast({ title: t('toast.successTitle'), description: t('pageBudgets.budgetSetSuccess') });
    }
    closeForm();
  };

  const openEditForm = (budget: Budget) => {
    setEditingBudget(budget);
    setAmount(budget.amount.toString());
    setSelectedCategoryId(budget.categoryId);
    setMonthYear(budget.monthYear);
    setIsFormOpen(true);
  };

  const handleDeleteBudget = (budgetId: string) => {
    saveBudgets(budgets.filter(b => b.id !== budgetId));
    toast({ title: t('toast.successTitle'), description: t('pageBudgets.budgetDeletedSuccess') });
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
    setAmount('');
    setSelectedCategoryId('');
    setMonthYear(getCurrentMonthYear());
  };

  const getCategoryName = (categoryId: string) => categories.find(c => c.id === categoryId)?.name || 'N/A';
  const getCategoryIcon = (categoryId: string) => categories.find(c => c.id === categoryId)?.icon || 'Sparkles';

  const calculateSpentAmount = (categoryId: string, currentMonthYear: string) => {
    return expenses
      .filter(e => e.categoryId === categoryId && e.date.startsWith(currentMonthYear))
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const filteredBudgets = budgets.filter(b => b.monthYear === monthYear).sort((a,b) => getCategoryName(a.categoryId).localeCompare(getCategoryName(b.categoryId)));

  return (
    <>
      <PageHeader title={t("pageBudgets.title")} description={t("pageBudgets.description")}>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> {t("pageBudgets.setBudget")}
        </Button>
      </PageHeader>

      <Card className="mb-6 shadow-md">
        <CardContent className="pt-6 flex flex-col sm:flex-row gap-4 items-center">
          <Label htmlFor="monthYearFilter" className="text-nowrap">{t("pageBudgets.viewBudgetsFor")}</Label>
          <Select value={monthYear} onValueChange={setMonthYear}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t("pageBudgets.selectMonthYear")} />
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set(budgets.map(b => b.monthYear).concat(getCurrentMonthYear())))
                .sort((a,b) => b.localeCompare(a)) 
                .map(my => (
                <SelectItem key={my} value={my}>{formatMonthYearForDisplay(my)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filteredBudgets.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-1">{t("pageBudgets.noBudgetsSetForMonth", formatMonthYearForDisplay(monthYear))}</h3>
              <p className="text-muted-foreground mb-4">{t("pageBudgets.createBudgetsToTrackGoals")}</p>
              <Button onClick={() => setIsFormOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t("pageBudgets.setBudget")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBudgets.map((budget) => {
            const spentAmount = calculateSpentAmount(budget.categoryId, budget.monthYear);
            const progress = budget.amount > 0 ? Math.min((spentAmount / budget.amount) * 100, 100) : 0;
            const isOverBudget = spentAmount > budget.amount;
            const remainingAmount = budget.amount - spentAmount;
            return (
              <Card key={budget.id} className="shadow-md hover:shadow-xl transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <CategoryIcon name={getCategoryIcon(budget.categoryId)} className="mr-3 h-6 w-6 text-primary" />
                      {getCategoryName(budget.categoryId)}
                    </CardTitle>
                     <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditForm(budget)} aria-label={t('common.edit')}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteBudget(budget.id)} aria-label={t('common.delete')}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                  </div>
                  <CardDescription className="text-sm">
                    {t("pageBudgets.budgetAmountForMonthYear", formatMonthYearForDisplay(budget.monthYear), formatCurrency(budget.amount))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className={isOverBudget ? "[&>div]:bg-destructive" : ""} />
                  <div className="mt-2 text-sm flex justify-between">
                    <span className={isOverBudget ? "text-destructive font-medium" : "text-muted-foreground"}>
                      {t("pageBudgets.spent")}: {formatCurrency(spentAmount)}
                    </span>
                    <span className={isOverBudget ? "text-destructive font-medium" : "text-muted-foreground"}>
                      {isOverBudget 
                        ? t("pageBudgets.overBy", formatCurrency(spentAmount - budget.amount))
                        : `${t("pageBudgets.remaining")}: ${formatCurrency(remainingAmount)}`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => { if(!isOpen) closeForm(); else setIsFormOpen(true); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingBudget ? t('pageBudgets.editBudgetDialogTitle') : t('pageBudgets.setNewBudgetDialogTitle')}</DialogTitle>
            <DialogDescription>
              {editingBudget ? t('pageBudgets.updateBudgetDetails') : t('pageBudgets.setSpendingGoalForCategory')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budgetAmount" className="text-right">{t("common.amount")}</Label>
              <Input id="budgetAmount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" placeholder="0.00" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budgetCategory" className="text-right">{t("common.category")}</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId} disabled={!!editingBudget}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('common.selectPlaceholder', t('common.category'))} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id} disabled={!editingBudget && budgets.some(b=>b.categoryId === cat.id && b.monthYear === monthYear)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budgetMonthYear" className="text-right">{t("pageBudgets.selectMonthYear")}</Label>
               <Select value={monthYear} onValueChange={setMonthYear} disabled={!!editingBudget}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("pageBudgets.selectMonthYear")} />
                </SelectTrigger>
                <SelectContent>
                   {Array.from({ length: 5 }, (_, i) => getYear(new Date()) - 2 + i).flatMap(year => 
                    Array.from({ length: 12 }, (_, monthIdx) => {
                      const date = new Date(year, monthIdx);
                      const value = format(date, "yyyy-MM");
                      const label = formatMonthYearForDisplay(value);
                      return { value, label };
                    })
                  ).sort((a,b) => b.value.localeCompare(a.value))
                  .map(my => (
                    <SelectItem key={my.value} value={my.value} disabled={!editingBudget && budgets.some(b=>b.categoryId === selectedCategoryId && b.monthYear === my.value)}>
                      {my.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>{t("common.cancel")}</Button>
            <Button onClick={handleFormSubmit}>{editingBudget ? t('common.saveChanges') : t('pageBudgets.setBudget')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
