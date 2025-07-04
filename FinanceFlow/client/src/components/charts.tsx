import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatCurrency, getCategoryColor } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface MonthlyExpense {
  month: string;
  total: number;
}

interface CategoryData {
  category: string;
  total: number;
  count: number;
}

export function Charts() {
  const { data: monthlyExpenses, isLoading: monthlyLoading } = useQuery<MonthlyExpense[]>({
    queryKey: ["/api/analytics/monthly-expenses"],
  });

  const { data: categoryData, isLoading: categoryLoading } = useQuery<CategoryData[]>({
    queryKey: ["/api/analytics/categories"],
  });

  const formatMonthlyData = (data: MonthlyExpense[]) => {
    return data.map(item => ({
      month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      total: item.total
    }));
  };

  const formatCategoryData = (data: CategoryData[]) => {
    return data.map(item => ({
      name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
      value: item.total,
      color: getCategoryColor(item.category)
    }));
  };

  return (
    <div className="space-y-8">
      {/* Monthly Expenses Chart */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-primary">
              Monthly Expenses
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-sm text-secondary hover:text-accent transition-colors">
                6M
              </Button>
              <Button variant="ghost" size="sm" className="text-sm text-accent bg-accent/10 px-3 py-1 rounded-full">
                1Y
              </Button>
              <Button variant="ghost" size="sm" className="text-sm text-secondary hover:text-accent transition-colors">
                All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {monthlyLoading ? (
            <div className="flex justify-center items-center h-80">
              <LoadingSpinner size="lg" />
            </div>
          ) : !monthlyExpenses || monthlyExpenses.length === 0 ? (
            <div className="flex justify-center items-center h-80">
              <p className="text-secondary">No expense data available</p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatMonthlyData(monthlyExpenses)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Expenses']}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="hsl(0, 84%, 60%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown Chart */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : !categoryData || categoryData.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-secondary">No category data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formatCategoryData(categoryData)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {formatCategoryData(categoryData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {formatCategoryData(categoryData).map((category, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium text-primary">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm text-secondary">
                      {formatCurrency(category.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
