
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
} from 'recharts';
import { expenses } from '@/utils/dummyData';
import { Expense } from '@/utils/types';
import { PlusCircle, ArrowUpCircle, ArrowDownCircle, BarChart4, PieChart as PieChartIcon, Calendar, Search, DollarSign, FilePlus } from 'lucide-react';
import { toast } from 'sonner';

const Finance = () => {
  const [expensesList, setExpensesList] = useState<Expense[]>(expenses);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formData, setFormData] = useState<Partial<Expense>>({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: 0,
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = value;
    
    if (name === 'amount') {
      newValue = Number(value);
    }
    
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.date) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const newExpense: Expense = {
      id: Date.now().toString(),
      date: formData.date || new Date().toISOString().split('T')[0],
      category: formData.category || '',
      amount: formData.amount || 0,
      description: formData.description || ''
    };
    
    setExpensesList([newExpense, ...expensesList]);
    toast.success('Dépense ajoutée avec succès');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: 0,
      description: ''
    });
    setIsAddingExpense(false);
  };

  const filteredExpenses = expensesList.filter(expense => {
    const matchesSearch = 
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate totals
  const totalExpenses = expensesList.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Get unique categories
  const categories = Array.from(new Set(expensesList.map(expense => expense.category)));
  
  // Prepare data for category chart
  const categoryData = categories.map(category => {
    const amount = expensesList
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      name: category,
      value: amount
    };
  });

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#8dd1e1'];

  // Sample income data (in a real app, this would come from a database)
  const incomeData = [
    { month: 'Jan', amount: 1200000 },
    { month: 'Fév', amount: 1350000 },
    { month: 'Mar', amount: 1450000 },
    { month: 'Avr', amount: 1300000 },
    { month: 'Mai', amount: 1500000 },
    { month: 'Juin', amount: 1700000 },
    { month: 'Juil', amount: 1600000 },
    { month: 'Août', amount: 1550000 },
    { month: 'Sep', amount: 1800000 },
    { month: 'Oct', amount: 1750000 }
  ];

  // Calculate profits
  const monthlyExpenses = {
    'Jan': 480000,
    'Fév': 520000,
    'Mar': 550000,
    'Avr': 510000,
    'Mai': 580000,
    'Juin': 620000,
    'Juil': 600000,
    'Août': 590000,
    'Sep': 650000,
    'Oct': 630000
  };

  const profitData = incomeData.map(item => ({
    month: item.month,
    profit: item.amount - (monthlyExpenses[item.month as keyof typeof monthlyExpenses] || 0)
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Finances</h2>
            <p className="text-muted-foreground">Gérez et analysez vos finances</p>
          </div>
          <Button onClick={() => setIsAddingExpense(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une dépense
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenus Octobre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ArrowUpCircle className="h-4 w-4 text-green-500 mr-2" />
                <div className="text-2xl font-bold">1,750,000 XOF</div>
              </div>
              <div className="text-xs text-muted-foreground">
                +5.2% par rapport au mois dernier
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Dépenses Octobre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ArrowDownCircle className="h-4 w-4 text-red-500 mr-2" />
                <div className="text-2xl font-bold">630,000 XOF</div>
              </div>
              <div className="text-xs text-muted-foreground">
                +3.1% par rapport au mois dernier
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Bénéfice Octobre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-primary mr-2" />
                <div className="text-2xl font-bold">1,120,000 XOF</div>
              </div>
              <div className="text-xs text-muted-foreground">
                +6.5% par rapport au mois dernier
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Marge Octobre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">64%</div>
              <div className="text-xs text-muted-foreground">
                +1.2% par rapport au mois dernier
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="expenses" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <TabsList>
              <TabsTrigger value="expenses" className="flex items-center">
                <ArrowDownCircle className="mr-2 h-4 w-4" />
                Dépenses
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center">
                <BarChart4 className="mr-2 h-4 w-4" />
                Analyse
              </TabsTrigger>
              <TabsTrigger value="profit" className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Bénéfices
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 w-full md:w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select 
                value={categoryFilter} 
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left font-medium text-sm">Date</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Catégorie</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Description</th>
                        <th className="px-4 py-3 text-right font-medium text-sm">Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                            Aucune dépense trouvée
                          </td>
                        </tr>
                      ) : (
                        filteredExpenses.map((expense) => (
                          <tr key={expense.id} className="border-b">
                            <td className="px-4 py-3">{expense.date}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
                                {expense.category}
                              </span>
                            </td>
                            <td className="px-4 py-3">{expense.description}</td>
                            <td className="px-4 py-3 text-right">{expense.amount.toLocaleString()} XOF</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t">
                        <td colSpan={3} className="px-4 py-3 font-medium text-right">
                          Total des dépenses
                        </td>
                        <td className="px-4 py-3 font-medium text-right">
                          {totalExpenses.toLocaleString()} XOF
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des dépenses</CardTitle>
                  <CardDescription>
                    Analyse par catégorie de dépense
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px] w-full p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Catégorie
                                      </span>
                                      <span className="font-bold text-muted-foreground">
                                        {payload[0].payload.name}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Montant
                                      </span>
                                      <span className="font-bold text-muted-foreground">
                                        {payload[0].value?.toLocaleString()} XOF
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ventilation des dépenses</CardTitle>
                  <CardDescription>
                    Résumé par catégorie
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left font-medium text-sm">Catégorie</th>
                          <th className="px-4 py-3 text-right font-medium text-sm">Montant</th>
                          <th className="px-4 py-3 text-right font-medium text-sm">Pourcentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryData.map((category) => (
                          <tr key={category.name} className="border-b">
                            <td className="px-4 py-3">{category.name}</td>
                            <td className="px-4 py-3 text-right">{category.value.toLocaleString()} XOF</td>
                            <td className="px-4 py-3 text-right">
                              {((category.value / totalExpenses) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t">
                          <td className="px-4 py-3 font-medium">Total</td>
                          <td className="px-4 py-3 font-medium text-right">
                            {totalExpenses.toLocaleString()} XOF
                          </td>
                          <td className="px-4 py-3 font-medium text-right">100%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compte d'exploitation</CardTitle>
                <CardDescription>
                  Évolution des bénéfices sur les 10 derniers mois
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] w-full p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={profitData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs text-muted-foreground" />
                      <YAxis
                        className="text-xs text-muted-foreground"
                        tickFormatter={(value) => `${value/1000000}M`}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Mois
                                    </span>
                                    <span className="font-bold text-muted-foreground">
                                      {payload[0].payload.month}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Bénéfice
                                    </span>
                                    <span className="font-bold text-muted-foreground">
                                      {payload[0].value?.toLocaleString()} XOF
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar 
                        dataKey="profit" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compte d'exploitation mensuel</CardTitle>
                <CardDescription>
                  Résumé financier du mois d'Octobre
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left font-medium text-sm">Catégorie</th>
                        <th className="px-4 py-3 text-right font-medium text-sm">Montant (XOF)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td colSpan={2} className="px-4 py-2 font-medium">Revenus</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-8 py-2">Ventes de produits</td>
                        <td className="px-4 py-2 text-right">1,750,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Total Revenus</td>
                        <td className="px-4 py-2 font-medium text-right">1,750,000</td>
                      </tr>
                      <tr className="border-b">
                        <td colSpan={2} className="px-4 py-2 font-medium">Dépenses</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-8 py-2">Achats de produits</td>
                        <td className="px-4 py-2 text-right">350,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-8 py-2">Loyer</td>
                        <td className="px-4 py-2 text-right">150,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-8 py-2">Personnel</td>
                        <td className="px-4 py-2 text-right">250,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-8 py-2">Electricité</td>
                        <td className="px-4 py-2 text-right">45,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-8 py-2">Internet</td>
                        <td className="px-4 py-2 text-right">30,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-8 py-2">Carburant</td>
                        <td className="px-4 py-2 text-right">35,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-8 py-2">Autres charges</td>
                        <td className="px-4 py-2 text-right">120,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 font-medium">Total Dépenses</td>
                        <td className="px-4 py-2 font-medium text-right">630,000</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-t">
                        <td className="px-4 py-3 font-medium">Bénéfice</td>
                        <td className="px-4 py-3 font-medium text-right text-green-600">
                          1,120,000
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">Marge</td>
                        <td className="px-4 py-2 font-medium text-right text-green-600">
                          64%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter une dépense</DialogTitle>
            <DialogDescription>
              Enregistrez une nouvelle dépense dans le système.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date" 
                  value={formData.date} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Loyer">Loyer</SelectItem>
                    <SelectItem value="Electricité">Electricité</SelectItem>
                    <SelectItem value="Personnel">Personnel</SelectItem>
                    <SelectItem value="Internet">Internet</SelectItem>
                    <SelectItem value="Carburant">Carburant</SelectItem>
                    <SelectItem value="Achats">Achats</SelectItem>
                    <SelectItem value="Taxes">Taxes</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Montant (XOF)</Label>
                <Input 
                  id="amount" 
                  name="amount" 
                  type="number" 
                  value={formData.amount} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Annuler
              </Button>
              <Button type="submit">
                Ajouter
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Finance;
