
"use client"; // Required for useEffect, useState if we were to fetch dynamic data. For static, it could be server.

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, ListChecks, AlertTriangle } from "lucide-react";
import { t, formatCurrency } from "@/lib/i18n";
import type { Expense, Budget, Category } from "@/lib/definitions"; // For future dynamic data
import { useEffect, useState } from "react"; // For future dynamic data

// Mock data for now - in a real app, this would come from state/props/API
const MOCK_TOTAL_SPENDING = 1250.75;
const MOCK_BUDGET_UTILIZATION = 65; // percentage
const MOCK_TOP_CATEGORY_KEY = "defaultCategories.grocery"; // Key for translation

export default function DashboardPage() {
  // State for dynamic data (example, not fully implemented with localStorage yet for dashboard)
  const [totalSpending, setTotalSpending] = useState(MOCK_TOTAL_SPENDING);
  const [budgetUtilization, setBudgetUtilization] = useState(MOCK_BUDGET_UTILIZATION);
  const [topCategory, setTopCategory] = useState(t(MOCK_TOP_CATEGORY_KEY));

  // In a real app, you'd fetch and calculate this data in useEffect
  // For example:
  // useEffect(() => {
  //   const expensesData: Expense[] = JSON.parse(localStorage.getItem('fiscallyFitExpenses') || '[]');
  //   const budgetsData: Budget[] = JSON.parse(localStorage.getItem('fiscallyFitBudgets') || '[]');
  //   const categoriesData: Category[] = JSON.parse(localStorage.getItem('fiscallyFitCategories') || '[]');
  //   // ... calculate totalSpending, budgetUtilization, topCategory
  //   // setTotalSpending(calculatedTotal);
  //   // setBudgetUtilization(calculatedUtilization);
  //   // setTopCategory(calculatedTopCategory); // ensure this is translated
  // }, []);


  const insights = [
    { titleKey: "pageDashboard.totalSpendingThisMonth", value: formatCurrency(totalSpending), icon: DollarSign, color: "text-primary" },
    { titleKey: "pageDashboard.budgetUtilization", value: `${budgetUtilization}%`, icon: TrendingUp, color: "text-accent" },
    { titleKey: "pageDashboard.topSpendingCategory", value: topCategory, icon: ListChecks, color: "text-secondary-foreground" },
  ];

  return (
    <>
      <PageHeader
        title={t("pageDashboard.title")}
        description={t("pageDashboard.description")}
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, index) => (
          <Card key={index} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(insight.titleKey)}
              </CardTitle>
              <insight.icon className={`h-5 w-5 ${insight.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{insight.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t("pageDashboard.spendingByCategory")}</CardTitle>
            <CardDescription>{t("pageDashboard.visualBreakdownExpenses")}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for chart */}
            <div className="flex items-center justify-center h-64 bg-muted/50 rounded-md">
              <p className="text-muted-foreground">{t("pageDashboard.categorySpendingChartComingSoon")}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t("pageDashboard.budgetProgress")}</CardTitle>
            <CardDescription>{t("pageDashboard.trackBudgetGoals")}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for budget progress */}
            <div className="flex items-center justify-center h-64 bg-muted/50 rounded-md">
              <p className="text-muted-foreground">{t("pageDashboard.budgetProgressBarsComingSoon")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 shadow-lg bg-destructive/10 border-destructive/30">
        <CardHeader className="flex flex-row items-center space-x-3 pb-2">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <CardTitle className="text-destructive">{t("pageDashboard.importantNotice")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive/80">
            {t("pageDashboard.demoNotice")}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
