import { pgTable, text, serial, decimal, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  date: timestamp("date").notNull(),
  type: varchar("type", { length: 10 }).notNull(), // 'income' or 'expense'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
}).extend({
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  description: z.string().min(1, "Description is required").max(255, "Description too long"),
  category: z.enum(["food", "transportation", "shopping", "entertainment", "utilities", "healthcare", "income", "other"], {
    errorMap: () => ({ message: "Please select a valid category" })
  }),
  date: z.string().min(1, "Date is required"),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Please select transaction type" })
  }),
});

export const updateTransactionSchema = insertTransactionSchema.partial();

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
