import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, ListChecks, AlertTriangle } from "lucide-react";

// Mock data for now
const totalSpending = 1250.75;
const budgetUtilization = 65; // percentage
const topCategory = "Groceries";
const insights = [
  { title: "Total Spending This Month", value: `$${totalSpending.toFixed(2)}`, icon: DollarSign, color: "text-primary" },
  { title: "Budget Utilization", value: `${budgetUtilization}%`, icon: TrendingUp, color: "text-accent" },
  { title: "Top Spending Category", value: topCategory, icon: ListChecks, color: "text-secondary-foreground" },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your financial overview at a glance."
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, index) => (
          <Card key={index} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {insight.title}
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
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Visual breakdown of your expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for chart */}
            <div className="flex items-center justify-center h-64 bg-muted/50 rounded-md">
              <p className="text-muted-foreground">Category Spending Chart Coming Soon</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>Track your progress towards budget goals.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for budget progress */}
            <div className="flex items-center justify-center h-64 bg-muted/50 rounded-md">
              <p className="text-muted-foreground">Budget Progress Bars Coming Soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 shadow-lg bg-destructive/10 border-destructive/30">
        <CardHeader className="flex flex-row items-center space-x-3 pb-2">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <CardTitle className="text-destructive">Important Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive/80">
            This is a demo application. OCR functionality and full data persistence are illustrative.
            Data entered is stored locally in your browser.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
