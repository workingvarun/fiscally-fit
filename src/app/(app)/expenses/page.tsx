"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit3, Trash2, CalendarIcon, ListChecks, X, DollarSign, FileText } from "lucide-react";
import type { Expense, Category, GroceryItem } from "@/lib/definitions";
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { DEFAULT_CATEGORIES } from '@/lib/constants';
import * as LucideIcons from 'lucide-react';

const iconMap: { [key: string]: LucideIcons.LucideIcon } = { ...LucideIcons };
const CategoryIcon = ({ name, ...props }: { name: string } & React.ComponentProps<LucideIcons.LucideIcon>) => {
  const IconComponent = iconMap[name] || LucideIcons.Sparkles;
  return <IconComponent {...props} />;
};


export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  // Form state
  const [amount, setAmount] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState('');
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    const storedExpenses = localStorage.getItem('fiscallyFitExpenses');
    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));

    const storedCategories = localStorage.getItem('fiscallyFitCategories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(DEFAULT_CATEGORIES); // Fallback to default if none stored
    }
  }, []);

  const saveExpenses = (updatedExpenses: Expense[]) => {
    setExpenses(updatedExpenses);
    localStorage.setItem('fiscallyFitExpenses', JSON.stringify(updatedExpenses));
  };

  const handleAddGroceryItem = () => {
    if (!itemName.trim() || !itemPrice.trim() || parseFloat(itemPrice) <= 0) {
      toast({ title: "Error", description: "Item name and valid price are required.", variant: "destructive" });
      return;
    }
    setGroceryItems([...groceryItems, { id: `item_${Date.now()}`, name: itemName, price: parseFloat(itemPrice) }]);
    setItemName('');
    setItemPrice('');
  };

  const handleRemoveGroceryItem = (itemId: string) => {
    setGroceryItems(groceryItems.filter(item => item.id !== itemId));
  };

  const handleFormSubmit = () => {
    if (!amount.trim() || parseFloat(amount) <= 0 || !selectedCategoryId || !date) {
      toast({ title: "Error", description: "Amount, category, and date are required.", variant: "destructive" });
      return;
    }

    const expenseData: Partial<Expense> = {
      amount: parseFloat(amount),
      categoryId: selectedCategoryId,
      date: date.toISOString(),
      notes: notes.trim() || undefined,
    };

    const selectedCategory = categories.find(c => c.id === selectedCategoryId);
    if (selectedCategory?.name.toLowerCase() === 'grocery' && groceryItems.length > 0) {
      expenseData.items = groceryItems;
      // Optionally adjust main amount to sum of items if desired, or keep it separate
      // expenseData.amount = groceryItems.reduce((sum, item) => sum + item.price, 0);
    }

    if (editingExpense) {
      const updatedExpenses = expenses.map(exp =>
        exp.id === editingExpense.id ? { ...exp, ...expenseData } as Expense : exp
      );
      saveExpenses(updatedExpenses);
      toast({ title: "Success", description: "Expense updated successfully." });
    } else {
      const newExpense: Expense = {
        id: `exp_${Date.now()}`,
        ...expenseData
      } as Expense;
      saveExpenses([...expenses, newExpense]);
      toast({ title: "Success", description: "Expense added successfully." });
    }
    closeForm();
  };

  const openEditForm = (expense: Expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount.toString());
    setSelectedCategoryId(expense.categoryId);
    setDate(parseISO(expense.date));
    setNotes(expense.notes || '');
    setGroceryItems(expense.items || []);
    setIsFormOpen(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    saveExpenses(expenses.filter(exp => exp.id !== expenseId));
    toast({ title: "Success", description: "Expense deleted successfully." });
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
    setAmount('');
    setSelectedCategoryId('');
    setDate(new Date());
    setNotes('');
    setGroceryItems([]);
    setItemName('');
    setItemPrice('');
  };

  const getCategoryName = (categoryId: string) => categories.find(c => c.id === categoryId)?.name || 'N/A';
  const getCategoryIcon = (categoryId: string) => categories.find(c => c.id === categoryId)?.icon || 'Sparkles';

  const isGroceryCategorySelected = categories.find(c => c.id === selectedCategoryId)?.name.toLowerCase() === 'grocery';

  return (
    <>
      <PageHeader title="Expenses" description="Track and manage your spending.">
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </PageHeader>

      {expenses.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <ListChecks className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-1">No Expenses Yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first expense entry.</p>
              <Button onClick={() => setIsFormOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense) => (
            <Card key={expense.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center">
                       <CategoryIcon name={getCategoryIcon(expense.categoryId)} className="mr-3 h-6 w-6 text-primary" />
                      {getCategoryName(expense.categoryId)}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {format(parseISO(expense.date), 'PPP')}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                     <p className="text-xl font-bold text-foreground">${expense.amount.toFixed(2)}</p>
                     <div className="flex space-x-1 mt-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditForm(expense)} aria-label="Edit expense">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteExpense(expense.id)} aria-label="Delete expense">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {expense.notes && <p className="text-sm text-foreground/80 mb-2 whitespace-pre-wrap"><FileText className="inline h-4 w-4 mr-1 text-muted-foreground"/>{expense.notes}</p>}
                {expense.items && expense.items.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium text-muted-foreground mb-1 uppercase">Items:</h4>
                    <ul className="list-disc list-inside pl-1 space-y-0.5 text-sm">
                      {expense.items.map(item => (
                        <li key={item.id} className="flex justify-between">
                          <span>{item.name}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => { if(!isOpen) closeForm(); else setIsFormOpen(true); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingExpense ? 'Edit' : 'Add New'} Expense</DialogTitle>
            <DialogDescription>
              {editingExpense ? 'Update the details for this expense.' : 'Record a new expense transaction.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" placeholder="0.00" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="col-span-3 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" placeholder="Optional notes (e.g., birthday gift, specific bill)" />
            </div>

            {isGroceryCategorySelected && (
              <div className="col-span-4 mt-2 p-3 border rounded-md">
                <h4 className="text-sm font-medium mb-2">Grocery Items</h4>
                <div className="space-y-2 mb-3">
                  {groceryItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <span className="text-sm">{item.name} - ${item.price.toFixed(2)}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleRemoveGroceryItem(item.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-grow">
                    <Label htmlFor="itemName" className="text-xs">Item Name</Label>
                    <Input id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g., Milk" />
                  </div>
                  <div className="w-24">
                     <Label htmlFor="itemPrice" className="text-xs">Price</Label>
                    <Input id="itemPrice" type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder="0.00" />
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddGroceryItem} className="self-end mb-px">Add Item</Button>
                </div>
                {groceryItems.length > 0 && (
                  <p className="text-sm font-medium mt-2">
                    Total Items: {groceryItems.length}, Total Price: ${groceryItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
            <Button onClick={handleFormSubmit}>{editingExpense ? 'Save Changes' : 'Add Expense'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
