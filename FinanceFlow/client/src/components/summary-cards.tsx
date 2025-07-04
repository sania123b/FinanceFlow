import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

interface SummaryData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
}

interface SummaryCardsProps {
  data: SummaryData;
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const { totalBalance, monthlyIncome, monthlyExpenses, savingsRate } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary font-medium">Total Balance</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="bg-accent/10 p-3 rounded-full">
              <Wallet className="h-5 w-5 text-accent" />
            </div>
          </div>
          <p className="text-xs text-success mt-2">
            <TrendingUp className="h-3 w-3 mr-1 inline" />
            +8.2% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary font-medium">Monthly Income</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(monthlyIncome)}</p>
            </div>
            <div className="bg-success/10 p-3 rounded-full">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
          </div>
          <p className="text-xs text-success mt-2">
            <TrendingUp className="h-3 w-3 mr-1 inline" />
            +12.5% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary font-medium">Monthly Expenses</p>
              <p className="text-2xl font-bold text-warning">{formatCurrency(monthlyExpenses)}</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-full">
              <TrendingDown className="h-5 w-5 text-warning" />
            </div>
          </div>
          <p className="text-xs text-warning mt-2">
            <TrendingUp className="h-3 w-3 mr-1 inline" />
            +5.1% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary font-medium">Savings Rate</p>
              <p className="text-2xl font-bold text-primary">{savingsRate.toFixed(1)}%</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <PiggyBank className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-xs text-success mt-2">
            <TrendingUp className="h-3 w-3 mr-1 inline" />
            +2.3% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
