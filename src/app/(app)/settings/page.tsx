
"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Moon, Sun, Bell, Palette, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleClearData = () => {
    if (confirm(t('common.areYouSure') + " " + t('pageSettings.clearAllLocalData') + "? " + t('common.actionCannotBeUndone'))) {
      localStorage.removeItem('fiscallyFitCategories');
      localStorage.removeItem('fiscallyFitExpenses');
      localStorage.removeItem('fiscallyFitBudgets');
      toast({ title: t('common.dataCleared'), description: t('common.allDataRemoved'), variant: "default" });
      window.location.reload();
    }
  };

  return (
    <>
      <PageHeader
        title={t("pageSettings.title")}
        description={t("pageSettings.description")}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> {t("pageSettings.appearance")}</CardTitle>
            <CardDescription>{t("pageSettings.customizeLookFeel")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode-switch" className="flex flex-col space-y-1">
                <span>{t("pageSettings.darkMode")}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  {t("pageSettings.toggleDarkLight")}
                </span>
              </Label>
              <div className="flex items-center">
                <Sun className="h-5 w-5 mr-2 text-muted-foreground" />
                <Switch
                  id="dark-mode-switch"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  aria-label={t("pageSettings.toggleDarkLight")}
                />
                <Moon className="h-5 w-5 ml-2 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" /> {t("pageSettings.notifications")}</CardTitle>
            <CardDescription>{t("pageSettings.manageNotificationPrefs")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="budget-alerts" className="flex flex-col space-y-1">
                <span>{t("pageSettings.budgetAlerts")}</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                  {t("pageSettings.receiveBudgetAlerts")}
                </span>
              </Label>
              <Switch id="budget-alerts" disabled aria-label={`${t("pageSettings.budgetAlerts")} (${t('common.disabled')})`} />
            </div>
             <p className="text-xs text-muted-foreground text-center">{t("pageSettings.notificationSettingsNotFunctional")}</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Lock className="mr-2 h-5 w-5 text-primary" /> {t("pageSettings.dataPrivacy")}</CardTitle>
            <CardDescription>{t("pageSettings.manageAppData")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Button variant="outline" className="w-full" disabled>{t("pageSettings.exportDataComingSoon")}</Button>
             <Button variant="destructive" className="w-full" onClick={handleClearData}>
                <AlertTriangle className="mr-2 h-4 w-4" /> {t("pageSettings.clearAllLocalData")}
             </Button>
             <p className="text-xs text-muted-foreground">
                {t("pageSettings.dataStorageNote")}
             </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
