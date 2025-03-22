
export type UserRole = 'admin' | 'seller';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface CarModel {
  id: string;
  brand: string;
  name: string;
  years: string[];
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  brand: string;
  compatibleCars: string[];
  purchasePrice: number; // XOF, without tax
  margin: number; // percentage
  sellingPriceExcludingTax: number;
  sellingPriceWithTax: number; // Including 18% tax
  stock: number;
  image?: string;
}

export interface StockEntry {
  id: string;
  date: string;
  productId: string;
  quantity: number;
  purchasePrice: number;
  total: number;
  createdBy: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxIncluded: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  customer: string | null;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paid: boolean;
  type: 'sale' | 'proforma';
  createdBy: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  loyaltyPoints: number;
  lastPurchase?: string;
  totalPurchases: number;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

export interface SalesAnalytics {
  topProducts: {productId: string, name: string, quantity: number}[];
  topBrands: {brand: string, sales: number}[];
  monthlySales: {month: string, amount: number}[];
  dailySales: {day: string, amount: number}[];
}

export interface DashboardStats {
  totalSalesAmount: number;
  totalSalesCount: number;
  lowStockCount: number;
  customersCount: number;
}
