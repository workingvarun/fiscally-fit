
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, CheckCircle, AlertCircle, Trash2, Loader2, Edit2, Save } from "lucide-react";
import Image from "next/image";
import { extractGroceryData, type ExtractGroceryDataInput, type ExtractGroceryDataOutput } from "@/ai/flows/extract-grocery-data";
import type { Expense, Category, GroceryItem } from "@/lib/definitions";
import { DEFAULT_CATEGORIES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { t, formatCurrency } from '@/lib/i18n';

export default function AddReceiptPage() {
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<GroceryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedCategories = localStorage.getItem('fiscallyFitCategories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(DEFAULT_CATEGORIES); // These names are already translated in constants.ts
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceiptImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setExtractedItems([]);
    }
  };

  const handleExtractData = async () => {
    if (!receiptImage || !receiptPreview) {
      toast({ title: t('toast.errorTitle'), description: t('pageAddReceipt.pleaseSelectReceiptImage'), variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setExtractedItems([]);

    try {
      const input: ExtractGroceryDataInput = { receiptDataUri: receiptPreview };
      const result: ExtractGroceryDataOutput = await extractGroceryData(input);
      
      if (result && result.items) {
        setExtractedItems(result.items.map((item, index) => ({ ...item, id: `ocr_item_${index}_${Date.now()}` })));
        toast({ title: t('toast.successTitle'), description: t('pageAddReceipt.dataExtractedReview'), variant: "default" });
      } else {
        throw new Error(t('pageAddReceipt.noItemsToSave'));
      }
    } catch (error) {
      console.error("OCR Error:", error);
      const errorMessage = error instanceof Error ? error.message : t('pageAddReceipt.ocrErrorUnknown');
      toast({ 
        title: t('toast.errorTitle'), 
        description: t('pageAddReceipt.ocrFailed', errorMessage), 
        variant: "destructive", 
        duration: 7000 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = (item: GroceryItem) => {
    setIsEditing(item.id);
    setEditName(item.name);
    setEditPrice(item.price.toString());
  };

  const handleSaveEdit = (itemId: string) => {
    if (!editName.trim() || !editPrice.trim() || parseFloat(editPrice) < 0) {
      toast({ title: t('toast.errorTitle'), description: t('pageExpenses.itemNamePriceRequired'), variant: "destructive" });
      return;
    }
    setExtractedItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, name: editName, price: parseFloat(editPrice) } : item
      )
    );
    setIsEditing(null);
  };

  const handleRemoveItem = (itemId: string) => {
    setExtractedItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleSaveExpense = () => {
    if (extractedItems.length === 0) {
      toast({ title: t('common.noItems'), description: t('pageAddReceipt.noItemsToSave'), variant: "destructive" });
      return;
    }

    const groceryCategoryName = t('defaultCategories.grocery').toLowerCase();
    const groceryCategory = categories.find(cat => cat.name.toLowerCase() === groceryCategoryName);
    
    if (!groceryCategory) {
      toast({ title: t('toast.errorTitle'), description: t('pageAddReceipt.groceryCategoryNotFound'), variant: "destructive" });
      return;
    }

    const totalAmount = extractedItems.reduce((sum, item) => sum + item.price, 0);

    const newExpense: Expense = {
      id: `exp_ocr_${Date.now()}`,
      categoryId: groceryCategory.id,
      amount: totalAmount,
      date: new Date().toISOString(),
      notes: `${t('defaultCategories.grocery')} ${t('pageAddReceipt.title')} ${t('common.processing').toLowerCase()} on ${new Date().toLocaleDateString()}`, // Example note
      items: extractedItems,
    };

    const existingExpenses: Expense[] = JSON.parse(localStorage.getItem('fiscallyFitExpenses') || '[]');
    localStorage.setItem('fiscallyFitExpenses', JSON.stringify([...existingExpenses, newExpense]));
    
    toast({ title: t('toast.successTitle'), description: t('pageAddReceipt.expenseSavedSuccess'), variant: "default" });
    setReceiptImage(null);
    setReceiptPreview(null);
    setExtractedItems([]);
    router.push('/expenses');
  };


  return (
    <>
      <PageHeader
        title={t('pageAddReceipt.title')}
        description={t('pageAddReceipt.description')}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('pageAddReceipt.uploadReceipt')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="receipt-upload" className="block text-sm font-medium text-muted-foreground mb-1">
                {t('pageAddReceipt.selectReceiptImage')}
              </Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {receiptPreview ? (
                    <Image src={receiptPreview} alt="Receipt preview" width={200} height={300} className="mx-auto h-48 w-auto object-contain rounded-md" data-ai-hint="receipt photo" />
                  ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  )}
                  <div className="flex text-sm text-muted-foreground justify-center">
                    <Label
                      htmlFor="receipt-upload"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring"
                    >
                      <span>{t('pageAddReceipt.uploadAFile')}</span>
                      <Input id="receipt-upload" name="receipt-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </Label>
                    <p className="pl-1">{t('pageAddReceipt.orDragAndDrop')}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('pageAddReceipt.fileFormatHint')}</p>
                </div>
              </div>
            </div>
            {receiptImage && (
              <div className="text-sm text-muted-foreground">
                {t('pageAddReceipt.selectedFile', receiptImage.name, (receiptImage.size / 1024).toFixed(1))}
              </div>
            )}
            <Button onClick={handleExtractData} disabled={!receiptImage || isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              {isLoading ? t('common.processing') : t('pageAddReceipt.extractData')}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('pageAddReceipt.reviewEditExtractedItems')}</CardTitle>
            <CardDescription>
              {extractedItems.length > 0 ? t('pageAddReceipt.verifyExtractedItems') : t('pageAddReceipt.extractedItemsWillAppearHere')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">{t('pageAddReceipt.extractingItems')}</p>
              </div>
            )}
            {!isLoading && extractedItems.length === 0 && !receiptImage && (
                <div className="text-center text-muted-foreground py-10">
                    <p>{t('pageAddReceipt.uploadReceiptToSeeResults')}</p>
                </div>
            )}
             {!isLoading && extractedItems.length === 0 && receiptImage && (
                <div className="text-center text-muted-foreground py-10">
                    <p>{t('pageAddReceipt.noItemsExtractedOrNotPerformed')}</p>
                     <p className="text-xs mt-1">{t('pageAddReceipt.tryClearerImage')}</p>
                </div>
            )}
            {extractedItems.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {extractedItems.map((item) => (
                  <div key={item.id} className="p-3 border rounded-md bg-background hover:bg-muted/50 transition-colors">
                    {isEditing === item.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder={t('pageAddReceipt.itemName')}
                          className="h-8 text-sm"
                        />
                        <Input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          placeholder={t('pageAddReceipt.price')}
                          className="h-8 text-sm"
                        />
                        <div className="flex justify-end gap-2 mt-1">
                           <Button size="sm" variant="outline" onClick={() => setIsEditing(null)}>{t('common.cancel')}</Button>
                           <Button size="sm" onClick={() => handleSaveEdit(item.id)}><Save className="h-3 w-3 mr-1"/> {t('common.save')}</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{item.name || t('pageAddReceipt.unnamedItem')}</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(item.price || 0)}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditItem(item)} aria-label={t('common.edit')}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80" onClick={() => handleRemoveItem(item.id)} aria-label={t('common.delete')}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                 <div className="pt-4 border-t">
                    <p className="text-lg font-semibold text-right">
                        {t('common.total')}: {formatCurrency(extractedItems.reduce((sum, item) => sum + item.price, 0))}
                    </p>
                </div>
              </div>
            )}
            {extractedItems.length > 0 && (
              <Button onClick={handleSaveExpense} className="w-full mt-6">
                <Save className="mr-2 h-4 w-4" /> {t('pageAddReceipt.saveAsGroceryExpense')}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8 bg-accent/10 border-accent/30">
        <CardHeader className="flex flex-row items-center space-x-3 pb-2">
          <CheckCircle className="h-6 w-6 text-accent-foreground" />
          <CardTitle className="text-accent-foreground">{t('pageAddReceipt.ocrTips')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-accent-foreground/80">
            <li>{t('pageAddReceipt.ocrTipClearImages')}</li>
            <li>{t('pageAddReceipt.ocrTipFlatReceipt')}</li>
            <li>{t('pageAddReceipt.ocrTipNoShadows')}</li>
            <li>{t('pageAddReceipt.ocrTipStandardReceipts')}</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
