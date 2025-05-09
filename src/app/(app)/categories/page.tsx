"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit3, Trash2, ShoppingCart, Car, Zap, Home, Film, HeartPulse, BookOpen, Sparkles, AlertTriangle, type LucideIcon, X, Tags } from "lucide-react";
import type { Category } from "@/lib/definitions";
import { AVAILABLE_CATEGORY_ICONS, DEFAULT_CATEGORIES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import * as LucideIcons from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  ShoppingCart, Car, Zap, Home, Film, HeartPulse, BookOpen, Sparkles, AlertTriangle, Tags,
  ...LucideIcons, // Add all lucide icons
};


const CategoryIcon = ({ name, ...props }: { name: string } & React.ComponentProps<LucideIcon>) => {
  const IconComponent = iconMap[name] || Sparkles; // Default to Sparkles if not found
  return <IconComponent {...props} />;
};


export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>(AVAILABLE_CATEGORY_ICONS[0]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCategories = localStorage.getItem('fiscallyFitCategories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(DEFAULT_CATEGORIES);
      localStorage.setItem('fiscallyFitCategories', JSON.stringify(DEFAULT_CATEGORIES));
    }
  }, []);

  const saveCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    localStorage.setItem('fiscallyFitCategories', JSON.stringify(updatedCategories));
  };

  const handleFormSubmit = () => {
    if (!categoryName.trim() || !selectedIcon) {
      toast({ title: "Error", description: "Category name and icon are required.", variant: "destructive" });
      return;
    }

    if (editingCategory) {
      const updatedCategories = categories.map(cat =>
        cat.id === editingCategory.id ? { ...cat, name: categoryName, icon: selectedIcon } : cat
      );
      saveCategories(updatedCategories);
      toast({ title: "Success", description: "Category updated successfully." });
    } else {
      const newCategory: Category = {
        id: `cat_${Date.now()}`,
        name: categoryName,
        icon: selectedIcon,
      };
      saveCategories([...categories, newCategory]);
      toast({ title: "Success", description: "Category added successfully." });
    }
    closeForm();
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setSelectedIcon(category.icon);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Check if category is used in expenses or budgets before deleting (not implemented here for brevity)
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    saveCategories(updatedCategories);
    toast({ title: "Success", description: "Category deleted successfully." });
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setCategoryName('');
    setSelectedIcon(AVAILABLE_CATEGORY_ICONS[0]);
  };

  return (
    <>
      <PageHeader title="Spending Categories" description="Manage your expense categories.">
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </PageHeader>

      {categories.length === 0 ? (
         <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Tags className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-1">No Categories Yet</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first spending category.</p>
                <Button onClick={() => setIsFormOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </div>
            </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Card key={category.id} className="shadow-md hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <CategoryIcon name={category.icon} className="mr-3 h-6 w-6 text-primary" />
                  {category.name}
                </CardTitle>
                <div className="flex space-x-1">
                   <Button variant="ghost" size="icon" onClick={() => openEditForm(category)} aria-label="Edit category">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteCategory(category.id)} aria-label="Delete category">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Track expenses for {category.name.toLowerCase()}.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={ (isOpen) => { if (!isOpen) closeForm(); else setIsFormOpen(true); } }>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit' : 'Add New'} Category</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update the details for this category.' : 'Create a new category to track your spending.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">Name</Label>
              <Input 
                id="categoryName" 
                value={categoryName} 
                onChange={(e) => setCategoryName(e.target.value)} 
                className="col-span-3"
                placeholder="e.g., Groceries, Rent"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryIcon" className="text-right pt-2 self-start">Icon</Label>
              <div className="col-span-3">
                <p className="text-sm text-muted-foreground mb-2">Select an icon for your category.</p>
                <ScrollArea className="h-48 rounded-md border p-2">
                  <div className="grid grid-cols-5 gap-2">
                    {AVAILABLE_CATEGORY_ICONS.map(iconName => (
                      <Button
                        key={iconName}
                        variant="outline"
                        size="icon"
                        className={`p-2 h-10 w-10 ${selectedIcon === iconName ? 'ring-2 ring-primary border-primary' : ''}`}
                        onClick={() => setSelectedIcon(iconName)}
                        aria-label={`Select icon ${iconName}`}
                      >
                        <CategoryIcon name={iconName} className="h-5 w-5" />
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
                {selectedIcon && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Selected:</span>
                    <CategoryIcon name={selectedIcon} className="h-5 w-5 text-primary" />
                    <Badge variant="secondary">{selectedIcon}</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
            <Button onClick={handleFormSubmit}>{editingCategory ? 'Save Changes' : 'Add Category'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
