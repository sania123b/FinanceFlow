import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate, getCategoryIcon } from "@/lib/utils";
import { Edit, Trash2, Plus } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Transaction } from "@shared/schema";

interface TransactionListProps {
  onEdit: (transaction: Transaction) => void;
}

export function TransactionList({ onEdit }: TransactionListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Success",
        description: "Transaction deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-primary">
            Recent Transactions
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-accent hover:text-accent/80 transition-colors font-medium"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!transactions || transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-lg font-medium text-primary mb-2">No transactions yet</h3>
            <p className="text-secondary text-sm">
              Add your first transaction to start tracking your finances
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-success/10' : 'bg-accent/10'
                  }`}>
                    <i className={`fas ${getCategoryIcon(transaction.category)} ${
                      transaction.type === 'income' ? 'text-success' : 'text-accent'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-primary">{transaction.description}</p>
                    <p className="text-sm text-secondary">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="text-xs">
                    {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                  </Badge>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-success' : 'text-warning'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(parseFloat(transaction.amount))}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(transaction)}
                      className="text-secondary hover:text-accent transition-colors p-1"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                      disabled={deleteMutation.isPending}
                      className="text-secondary hover:text-warning transition-colors p-1"
                    >
                      {deleteMutation.isPending ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
