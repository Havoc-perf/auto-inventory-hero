
import { User, Category, Brand, CarModel, Product, StockEntry, Invoice, Customer, Expense, SalesAnalytics, DashboardStats } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@autoparts.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
  },
  {
    id: '2',
    name: 'Seller User',
    email: 'seller@autoparts.com',
    role: 'seller',
    avatar: 'https://ui-avatars.com/api/?name=Seller+User&background=0D8ABC&color=fff'
  }
];

export const categories: Category[] = [
  { id: '1', name: 'Filtres' },
  { id: '2', name: 'Huiles' },
  { id: '3', name: 'Freins' },
  { id: '4', name: 'Batteries' },
  { id: '5', name: 'Éclairage' },
  { id: '6', name: 'Suspension' }
];

export const brands: Brand[] = [
  { id: '1', name: 'Bosch' },
  { id: '2', name: 'NGK' },
  { id: '3', name: 'Total' },
  { id: '4', name: 'Valeo' },
  { id: '5', name: 'Delphi' }
];

export const carModels: CarModel[] = [
  { id: '1', brand: 'Toyota', name: 'Corolla', years: ['2018-2023', '2010-2017', '2000-2009'] },
  { id: '2', brand: 'Toyota', name: 'RAV4', years: ['2018-2023', '2010-2017', '2000-2009'] },
  { id: '3', brand: 'Nissan', name: 'Qashqai', years: ['2018-2023', '2010-2017'] },
  { id: '4', brand: 'Renault', name: 'Clio', years: ['2018-2023', '2010-2017', '2000-2009'] },
  { id: '5', brand: 'Peugeot', name: '208', years: ['2018-2023', '2010-2017'] }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Filtre à huile Bosch',
    barcode: '4001234567890',
    category: '1',
    brand: '1',
    compatibleCars: ['1', '2'],
    purchasePrice: 5000,
    margin: 30,
    sellingPriceExcludingTax: 6500,
    sellingPriceWithTax: 7670, // 6500 * 1.18
    stock: 42,
    image: 'https://images.unsplash.com/photo-1619885844268-9429a57d82bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '2',
    name: 'Batterie Bosch S4',
    barcode: '4007954321098',
    category: '4',
    brand: '1',
    compatibleCars: ['1', '2', '3', '4', '5'],
    purchasePrice: 45000,
    margin: 25,
    sellingPriceExcludingTax: 56250,
    sellingPriceWithTax: 66375, // 56250 * 1.18
    stock: 15,
    image: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '3',
    name: 'Huile moteur Total Quartz 5W40',
    barcode: '3004567890123',
    category: '2',
    brand: '3',
    compatibleCars: ['1', '2', '3', '4', '5'],
    purchasePrice: 12000,
    margin: 20,
    sellingPriceExcludingTax: 14400,
    sellingPriceWithTax: 16992, // 14400 * 1.18
    stock: 30,
    image: 'https://images.unsplash.com/photo-1603638725968-f6b2d1a9c670?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '4',
    name: 'Plaquettes de frein Valeo',
    barcode: '3305678901234',
    category: '3',
    brand: '4',
    compatibleCars: ['1', '4', '5'],
    purchasePrice: 18000,
    margin: 35,
    sellingPriceExcludingTax: 24300,
    sellingPriceWithTax: 28674, // 24300 * 1.18
    stock: 22,
    image: 'https://images.unsplash.com/photo-1600260178932-9ebc5d849adb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '5',
    name: 'Ampoule phare NGK',
    barcode: '7896543210987',
    category: '5',
    brand: '2',
    compatibleCars: ['1', '2', '3', '4', '5'],
    purchasePrice: 3000,
    margin: 40,
    sellingPriceExcludingTax: 4200,
    sellingPriceWithTax: 4956, // 4200 * 1.18
    stock: 50,
    image: 'https://images.unsplash.com/photo-1642371759925-62dc97e6611c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
  }
];

export const stockEntries: StockEntry[] = [
  {
    id: '1',
    date: '2023-10-01',
    productId: '1',
    quantity: 20,
    purchasePrice: 5000,
    total: 100000,
    createdBy: '1'
  },
  {
    id: '2',
    date: '2023-10-05',
    productId: '2',
    quantity: 5,
    purchasePrice: 45000,
    total: 225000,
    createdBy: '1'
  },
  {
    id: '3',
    date: '2023-10-10',
    productId: '3',
    quantity: 15,
    purchasePrice: 12000,
    total: 180000,
    createdBy: '2'
  },
  {
    id: '4',
    date: '2023-10-15',
    productId: '4',
    quantity: 10,
    purchasePrice: 18000,
    total: 180000,
    createdBy: '1'
  },
  {
    id: '5',
    date: '2023-10-20',
    productId: '5',
    quantity: 25,
    purchasePrice: 3000,
    total: 75000,
    createdBy: '2'
  }
];

export const invoices: Invoice[] = [
  {
    id: 'INV-001',
    date: '2023-10-25',
    customer: '1',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Filtre à huile Bosch',
        quantity: 2,
        unitPrice: 7670,
        total: 15340,
        taxIncluded: true
      },
      {
        id: '2',
        productId: '3',
        productName: 'Huile moteur Total Quartz 5W40',
        quantity: 1,
        unitPrice: 16992,
        total: 16992,
        taxIncluded: true
      }
    ],
    subtotal: 27407,
    tax: 4925,
    total: 32332,
    paid: true,
    type: 'sale',
    createdBy: '2'
  },
  {
    id: 'INV-002',
    date: '2023-10-26',
    customer: '2',
    items: [
      {
        id: '1',
        productId: '2',
        productName: 'Batterie Bosch S4',
        quantity: 1,
        unitPrice: 66375,
        total: 66375,
        taxIncluded: true
      }
    ],
    subtotal: 56250,
    tax: 10125,
    total: 66375,
    paid: true,
    type: 'sale',
    createdBy: '2'
  },
  {
    id: 'PRO-001',
    date: '2023-10-27',
    customer: '3',
    items: [
      {
        id: '1',
        productId: '4',
        productName: 'Plaquettes de frein Valeo',
        quantity: 1,
        unitPrice: 28674,
        total: 28674,
        taxIncluded: true
      },
      {
        id: '2',
        productId: '5',
        productName: 'Ampoule phare NGK',
        quantity: 4,
        unitPrice: 4956,
        total: 19824,
        taxIncluded: true
      }
    ],
    subtotal: 41100,
    tax: 7398,
    total: 48498,
    paid: false,
    type: 'proforma',
    createdBy: '1'
  }
];

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    phone: '+229 97123456',
    email: 'jean.dupont@email.com',
    address: 'Cotonou, Bénin',
    loyaltyPoints: 150,
    lastPurchase: '2023-10-25',
    totalPurchases: 3
  },
  {
    id: '2',
    name: 'Marie Koné',
    phone: '+225 0712345678',
    email: 'marie.kone@email.com',
    address: 'Abidjan, Côte d\'Ivoire',
    loyaltyPoints: 200,
    lastPurchase: '2023-10-26',
    totalPurchases: 5
  },
  {
    id: '3',
    name: 'Amadou Diallo',
    phone: '+221 77123456',
    loyaltyPoints: 0,
    totalPurchases: 0
  }
];

export const expenses: Expense[] = [
  {
    id: '1',
    date: '2023-10-01',
    category: 'Loyer',
    amount: 150000,
    description: 'Loyer mensuel du magasin'
  },
  {
    id: '2',
    date: '2023-10-05',
    category: 'Electricité',
    amount: 45000,
    description: 'Facture d\'électricité'
  },
  {
    id: '3',
    date: '2023-10-10',
    category: 'Personnel',
    amount: 250000,
    description: 'Salaires'
  },
  {
    id: '4',
    date: '2023-10-15',
    category: 'Internet',
    amount: 30000,
    description: 'Abonnement internet'
  },
  {
    id: '5',
    date: '2023-10-20',
    category: 'Carburant',
    amount: 35000,
    description: 'Carburant pour livraison'
  }
];

export const salesAnalytics: SalesAnalytics = {
  topProducts: [
    { productId: '1', name: 'Filtre à huile Bosch', quantity: 45 },
    { productId: '3', name: 'Huile moteur Total Quartz 5W40', quantity: 38 },
    { productId: '2', name: 'Batterie Bosch S4', quantity: 32 },
    { productId: '5', name: 'Ampoule phare NGK', quantity: 25 },
    { productId: '4', name: 'Plaquettes de frein Valeo', quantity: 18 }
  ],
  topBrands: [
    { brand: 'Bosch', sales: 450000 },
    { brand: 'Total', sales: 350000 },
    { brand: 'NGK', sales: 200000 },
    { brand: 'Valeo', sales: 180000 },
    { brand: 'Delphi', sales: 120000 }
  ],
  monthlySales: [
    { month: 'Jan', amount: 1200000 },
    { month: 'Fév', amount: 1350000 },
    { month: 'Mar', amount: 1450000 },
    { month: 'Avr', amount: 1300000 },
    { month: 'Mai', amount: 1500000 },
    { month: 'Juin', amount: 1700000 },
    { month: 'Juil', amount: 1600000 },
    { month: 'Août', amount: 1550000 },
    { month: 'Sep', amount: 1800000 },
    { month: 'Oct', amount: 1750000 },
    { month: 'Nov', amount: 0 },
    { month: 'Déc', amount: 0 }
  ],
  dailySales: [
    { day: 'Lun', amount: 85000 },
    { day: 'Mar', amount: 95000 },
    { day: 'Mer', amount: 120000 },
    { day: 'Jeu', amount: 110000 },
    { day: 'Ven', amount: 150000 },
    { day: 'Sam', amount: 180000 },
    { day: 'Dim', amount: 60000 }
  ]
};

export const dashboardStats: DashboardStats = {
  totalSalesAmount: 147205,
  totalSalesCount: 2,
  lowStockCount: 2,
  customersCount: 3
};
