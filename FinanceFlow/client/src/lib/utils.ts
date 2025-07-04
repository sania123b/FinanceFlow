import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateForInput(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    food: "fa-utensils",
    transportation: "fa-car",
    shopping: "fa-shopping-cart",
    entertainment: "fa-film",
    utilities: "fa-bolt",
    healthcare: "fa-heartbeat",
    income: "fa-dollar-sign",
    other: "fa-question-circle",
  };
  return icons[category] || "fa-question-circle";
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    food: "hsl(142, 76%, 36%)",
    transportation: "hsl(0, 84%, 60%)",
    shopping: "hsl(217, 91%, 60%)",
    entertainment: "hsl(262, 83%, 58%)",
    utilities: "hsl(45, 93%, 47%)",
    healthcare: "hsl(339, 82%, 52%)",
    income: "hsl(142, 76%, 36%)",
    other: "hsl(215, 25%, 27%)",
  };
  return colors[category] || "hsl(215, 25%, 27%)";
}
