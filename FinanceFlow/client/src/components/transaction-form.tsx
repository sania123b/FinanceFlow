import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTransactionSchema, type InsertTransaction } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDateForInput } from "@/lib/utils";

interface TransactionFormProps {
  editingTransaction?: any;
  onEditCancel?: () => void;
}

export function TransactionForm({ editingTransaction, onEditCancel }: TransactionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isResetting, setIsResetting] = useState(false);

  const form = useForm<InsertTransaction>({
    resolver: zodResolver(insertTransactionSchema),
    defaultValues: {
      amount: editingTransaction?.amount || "",
      description: editingTransaction?.description || "",
      category: editingTransaction?.category || "",
      date: editingTransaction?.date ? formatDateForInput(editingTransaction.date) : formatDateForInput(new Date()),
      type: editingTransaction?.type || "expense",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTransaction) => {
      const response = await apiRequest("POST", "/api/transactions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Success",
        description: "Transaction added successfully!",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add transaction",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertTransaction) => {
      const response = await apiRequest("PUT", `/api/transactions/${editingTransaction.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Success",
        description: "Transaction updated successfully!",
      });
      onEditCancel?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update transaction",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTransaction) => {
    if (editingTransaction) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleReset = () => {
    setIsResetting(true);
    form.reset();
    setTimeout(() => setIsResetting(false), 100);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          {editingTransaction ? "Edit Transaction" : "Add Transaction"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-sm font-medium text-primary">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">
                $
              </span>
              <Input
                id="amount"
                type="text"
                placeholder="0.00"
                className="pl-8 focus:ring-2 focus:ring-accent focus:border-transparent"
                {...form.register("amount")}
              />
            </div>
            {form.formState.errors.amount && (
              <p className="text-xs text-warning mt-1">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-primary">
              Description
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Enter description"
              className="focus:ring-2 focus:ring-accent focus:border-transparent"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-warning mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-primary">Category</Label>
            <Select
              value={form.watch("category")}
              onValueChange={(value) => form.setValue("category", value as any)}
            >
              <SelectTrigger className="focus:ring-2 focus:ring-accent focus:border-transparent">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-xs text-warning mt-1">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="date" className="text-sm font-medium text-primary">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              className="focus:ring-2 focus:ring-accent focus:border-transparent"
              {...form.register("date")}
            />
            {form.formState.errors.date && (
              <p className="text-xs text-warning mt-1">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-primary">Type</Label>
            <RadioGroup
              value={form.watch("type")}
              onValueChange={(value) => form.setValue("type", value as any)}
              className="grid grid-cols-2 gap-2 mt-2"
            >
              <div className="flex items-center space-x-2 p-3 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="text-sm font-medium text-primary cursor-pointer">
                  Income
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="text-sm font-medium text-primary cursor-pointer">
                  Expense
                </Label>
              </div>
            </RadioGroup>
            {form.formState.errors.type && (
              <p className="text-xs text-warning mt-1">
                {form.formState.errors.type.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-accent text-white hover:bg-accent/90 transition-colors font-medium"
            >
              {isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {editingTransaction ? "Updating..." : "Adding..."}
                </>
              ) : (
                editingTransaction ? "Update Transaction" : "Add Transaction"
              )}
            </Button>
            {editingTransaction ? (
              <Button
                type="button"
                variant="outline"
                onClick={onEditCancel}
                className="px-4 py-2 border-slate-300 text-secondary hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isResetting}
                className="px-4 py-2 border-slate-300 text-secondary hover:bg-slate-50 transition-colors"
              >
                {isResetting ? <LoadingSpinner size="sm" /> : "Reset"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
