import { transactions, type Transaction, type InsertTransaction, type UpdateTransaction } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // Transaction CRUD operations
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: UpdateTransaction): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  
  // Analytics methods
  getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
  getTransactionsByCategory(): Promise<{ category: string; total: number; count: number }[]>;
  getMonthlyExpenses(): Promise<{ month: string; total: number }[]>;
}

export class DatabaseStorage implements IStorage {
  async getTransactions(): Promise<Transaction[]> {
    const result = await db.select().from(transactions).orderBy(desc(transactions.date));
    return result;
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [result] = await db.select().from(transactions).where(eq(transactions.id, id));
    return result || undefined;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [result] = await db
      .insert(transactions)
      .values({
        amount: insertTransaction.amount,
        description: insertTransaction.description,
        category: insertTransaction.category,
        date: new Date(insertTransaction.date),
        type: insertTransaction.type,
      })
      .returning();
    return result;
  }

  async updateTransaction(id: number, updateTransaction: UpdateTransaction): Promise<Transaction | undefined> {
    const updateData: any = {};
    
    if (updateTransaction.amount !== undefined) updateData.amount = updateTransaction.amount;
    if (updateTransaction.description !== undefined) updateData.description = updateTransaction.description;
    if (updateTransaction.category !== undefined) updateData.category = updateTransaction.category;
    if (updateTransaction.date !== undefined) updateData.date = new Date(updateTransaction.date);
    if (updateTransaction.type !== undefined) updateData.type = updateTransaction.type;

    const [result] = await db
      .update(transactions)
      .set(updateData)
      .where(eq(transactions.id, id))
      .returning();
    
    return result || undefined;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    const result = await db.delete(transactions).where(eq(transactions.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    const result = await db
      .select()
      .from(transactions)
      .where(and(
        gte(transactions.date, startDate),
        lte(transactions.date, endDate)
      ))
      .orderBy(desc(transactions.date));
    return result;
  }

  async getTransactionsByCategory(): Promise<{ category: string; total: number; count: number }[]> {
    const result = await db
      .select({
        category: transactions.category,
        total: sql<number>`sum(${transactions.amount}::numeric)`.as('total'),
        count: sql<number>`count(*)`.as('count')
      })
      .from(transactions)
      .where(eq(transactions.type, 'expense'))
      .groupBy(transactions.category);
    
    return result.map(row => ({
      category: row.category,
      total: Number(row.total),
      count: Number(row.count)
    }));
  }

  async getMonthlyExpenses(): Promise<{ month: string; total: number }[]> {
    const result = await db
      .select({
        month: sql<string>`to_char(${transactions.date}, 'YYYY-MM')`.as('month'),
        total: sql<number>`sum(${transactions.amount}::numeric)`.as('total')
      })
      .from(transactions)
      .where(eq(transactions.type, 'expense'))
      .groupBy(sql`to_char(${transactions.date}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${transactions.date}, 'YYYY-MM')`);
    
    return result.map(row => ({
      month: row.month,
      total: Number(row.total)
    }));
  }
}

export const storage = new DatabaseStorage();
