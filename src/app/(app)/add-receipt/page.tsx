"use client";

import { useState, useEffect, useCallback } from 'react';
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
import { useRouter } from 'next/navigation'; // For redirecting

export default function AddReceiptPage() {
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<GroceryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null); // Stores ID of item being edited
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
      setCategories(DEFAULT_CATEGORIES);
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
      setExtractedItems([]); // Clear previous results
    }
  };

  const handleExtractData = async () => {
    if (!receiptImage || !receiptPreview) {
      toast({ title: "Error", description: "Please select a receipt image.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setExtractedItems([]);

    try {
      const input: ExtractGroceryDataInput = { receiptDataUri: receiptPreview };
      const result: ExtractGroceryDataOutput = await extractGroceryData(input);
      
      if (result && result.items) {
        setExtractedItems(result.items.map((item, index) => ({ ...item, id: `ocr_item_${index}_${Date.now()}` })));
        toast({ title: "Success", description: "Data extracted. Please review and edit if necessary.", variant: "default" });
      } else {
        throw new Error("No items found in OCR result.");
      }
    } catch (error) {
      console.error("OCR Error:", error);
      toast({ title: "OCR Failed", description: `Could not extract data: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or enter manually.`, variant: "destructive", duration: 7000 });
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
      toast({ title: "Error", description: "Item name and valid price are required.", variant: "destructive" });
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
      toast({ title: "No items", description: "No items to save as an expense.", variant: "destructive" });
      return;
    }

    const groceryCategory = categories.find(cat => cat.name.toLowerCase() === "grocery");
    if (!groceryCategory) {
      toast({ title: "Error", description: "Grocery category not found. Please create one.", variant: "destructive" });
      return;
    }

    const totalAmount = extractedItems.reduce((sum, item) => sum + item.price, 0);

    const newExpense: Expense = {
      id: `exp_ocr_${Date.now()}`,
      categoryId: groceryCategory.id,
      amount: totalAmount,
      date: new Date().toISOString(),
      notes: `Grocery receipt processed via OCR on ${new Date().toLocaleDateString()}`,
      items: extractedItems,
    };

    const existingExpenses: Expense[] = JSON.parse(localStorage.getItem('fiscallyFitExpenses') || '[]');
    localStorage.setItem('fiscallyFitExpenses', JSON.stringify([...existingExpenses, newExpense]));
    
    toast({ title: "Expense Saved", description: "Grocery expense saved successfully!", variant: "default" });
    // Reset state
    setReceiptImage(null);
    setReceiptPreview(null);
    setExtractedItems([]);
    // Redirect to expenses page
    router.push('/expenses');
  };


  return (
    <>
      <PageHeader
        title="Add Grocery Receipt"
        description="Upload a receipt image to automatically extract items and prices using OCR."
      />

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>1. Upload Receipt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="receipt-upload" className="block text-sm font-medium text-muted-foreground mb-1">
                Select Receipt Image
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
                      <span>Upload a file</span>
                      <Input id="receipt-upload" name="receipt-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </Label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            {receiptImage && (
              <div className="text-sm text-muted-foreground">
                Selected: {receiptImage.name} ({(receiptImage.size / 1024).toFixed(1)} KB)
              </div>
            )}
            <Button onClick={handleExtractData} disabled={!receiptImage || isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              {isLoading ? "Processing..." : "Extract Data"}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>2. Review & Edit Extracted Items</CardTitle>
            <CardDescription>
              {extractedItems.length > 0 ? "Verify the extracted items and make corrections if needed." : "Extracted items will appear here."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Extracting items...</p>
              </div>
            )}
            {!isLoading && extractedItems.length === 0 && !receiptImage && (
                <div className="text-center text-muted-foreground py-10">
                    <p>Upload a receipt image and click "Extract Data" to see results.</p>
                </div>
            )}
             {!isLoading && extractedItems.length === 0 && receiptImage && (
                <div className="text-center text-muted-foreground py-10">
                    <p>No items extracted, or extraction not yet performed.</p>
                     <p className="text-xs mt-1">If extraction failed, try a clearer image or different lighting.</p>
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
                          placeholder="Item Name"
                          className="h-8 text-sm"
                        />
                        <Input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          placeholder="Price"
                          className="h-8 text-sm"
                        />
                        <div className="flex justify-end gap-2 mt-1">
                           <Button size="sm" variant="outline" onClick={() => setIsEditing(null)}>Cancel</Button>
                           <Button size="sm" onClick={() => handleSaveEdit(item.id)}><Save className="h-3 w-3 mr-1"/> Save</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{item.name || "Unnamed Item"}</p>
                          <p className="text-sm text-muted-foreground">${item.price?.toFixed(2) || "0.00"}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditItem(item)} aria-label="Edit item">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80" onClick={() => handleRemoveItem(item.id)} aria-label="Delete item">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                 <div className="pt-4 border-t">
                    <p className="text-lg font-semibold text-right">
                        Total: ${extractedItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </p>
                </div>
              </div>
            )}
            {extractedItems.length > 0 && (
              <Button onClick={handleSaveExpense} className="w-full mt-6">
                <Save className="mr-2 h-4 w-4" /> Save as Grocery Expense
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8 bg-accent/10 border-accent/30">
        <CardHeader className="flex flex-row items-center space-x-3 pb-2">
          <CheckCircle className="h-6 w-6 text-accent-foreground" />
          <CardTitle className="text-accent-foreground">OCR Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-accent-foreground/80">
            <li>Use clear, well-lit images of your receipts.</li>
            <li>Ensure the receipt is flat and not crumpled.</li>
            <li>Avoid shadows or glare on the receipt.</li>
            <li>The OCR is optimized for standard grocery receipts. Complex layouts might have lower accuracy.</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
