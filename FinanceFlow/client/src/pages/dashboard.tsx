import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SummaryCards } from "@/components/summary-cards";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";
import { Charts } from "@/components/charts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Transaction } from "@shared/schema";

interface SummaryData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
}

export default function Dashboard() {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { data: summaryData, isLoading: summaryLoading } = useQuery<SummaryData>({
    queryKey: ["/api/analytics/summary"],
  });

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleEditCancel = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <i className="fas fa-chart-line text-accent text-2xl mr-3"></i>
              <h1 className="text-xl font-bold text-primary">FinanceTracker</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-primary hover:text-accent transition-colors font-medium">
                Dashboard
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors font-medium">
                Transactions
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors font-medium">
                Categories
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors font-medium">
                Budgets
              </a>
            </nav>
            <button className="md:hidden text-primary">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="mb-8">
          {summaryLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : summaryData ? (
            <SummaryCards data={summaryData} />
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary">Unable to load summary data</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Form */}
          <div className="lg:col-span-1">
            <TransactionForm
              editingTransaction={editingTransaction}
              onEditCancel={handleEditCancel}
            />
          </div>

          {/* Charts and Transaction List */}
          <div className="lg:col-span-2 space-y-8">
            <Charts />
            <TransactionList onEdit={handleEditTransaction} />
          </div>
        </div>
      </main>
    </div>
  );
}
