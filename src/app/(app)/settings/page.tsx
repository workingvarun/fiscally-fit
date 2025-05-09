"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Moon, Sun, Bell, Palette, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all app data? This action cannot be undone.")) {
      localStorage.removeItem('fiscallyFitCategories');
      localStorage.removeItem('fiscallyFitExpenses');
      localStorage.removeItem('fiscallyFitBudgets');
      toast({ title: "Data Cleared", description: "All application data has been removed from local storage.", variant: "default" });
      // Optionally, redirect or refresh to reflect changes
      window.location.reload();
    }
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your application preferences and data."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode-switch" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Toggle between light and dark themes.
                </span>
              </Label>
              <div className="flex items-center">
                <Sun className="h-5 w-5 mr-2 text-muted-foreground" />
                <Switch
                  id="dark-mode-switch"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  aria-label="Toggle dark mode"
                />
                <Moon className="h-5 w-5 ml-2 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" /> Notifications</CardTitle>
            <CardDescription>Manage your notification preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="budget-alerts" className="flex flex-col space-y-1">
                <span>Budget Alerts</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                  Receive alerts for budget milestones.
                </span>
              </Label>
              <Switch id="budget-alerts" disabled aria-label="Toggle budget alerts (disabled)" />
            </div>
             <p className="text-xs text-muted-foreground text-center">Notification settings are illustrative and not functional in this demo.</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Lock className="mr-2 h-5 w-5 text-primary" /> Data & Privacy</CardTitle>
            <CardDescription>Manage your application data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Button variant="outline" className="w-full" disabled>Export Data (Coming Soon)</Button>
             <Button variant="destructive" className="w-full" onClick={handleClearData}>
                <AlertTriangle className="mr-2 h-4 w-4" /> Clear All Local Data
             </Button>
             <p className="text-xs text-muted-foreground">
                This application stores data in your browser's local storage. Clearing data will remove all categories, expenses, and budgets.
             </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
