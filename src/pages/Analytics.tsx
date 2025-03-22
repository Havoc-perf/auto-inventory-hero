
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { salesAnalytics, products, brands } from '@/utils/dummyData';
import { Printer, FileDown, BarChartIcon, PieChart as PieChartIcon, TrendingUp, LineChart as LineChartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Analytics = () => {
  const [period, setPeriod] = useState('monthly');

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Helper function to get brand name
  const getBrandName = (id: string) => {
    const brand = brands.find(b => b.id === id);
    return brand ? brand.name : 'Inconnu';
  };

  // Prepare data for brand sales
  const brandSalesData = salesAnalytics.topBrands.map(item => ({
    name: item.brand,
    value: item.sales
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analyses</h2>
            <p className="text-muted-foreground">Visualisez et analysez vos données de vente</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Tabs defaultValue="sales" className="w-full">
            <TabsList>
              <TabsTrigger value="sales" className="flex items-center">
                <BarChartIcon className="mr-2 h-4 w-4" />
                Ventes
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center">
                <PieChartIcon className="mr-2 h-4 w-4" />
                Produits
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Tendances
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 mb-6">
              <Select defaultValue="monthly" onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Journalier</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="yearly">Annuel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="sales" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Ventes totales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">14,758,250 XOF</div>
                    <div className="text-xs text-muted-foreground">+12.5% par rapport à l'année dernière</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Nombre de ventes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,483</div>
                    <div className="text-xs text-muted-foreground">+8.2% par rapport à l'année dernière</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Valeur moyenne</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">9,952 XOF</div>
                    <div className="text-xs text-muted-foreground">+3.7% par rapport à l'année dernière</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Marge bénéficiaire</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">28.5%</div>
                    <div className="text-xs text-muted-foreground">+1.2% par rapport à l'année dernière</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Évolution des ventes</CardTitle>
                  <CardDescription>
                    {period === 'monthly' && "Évolution des ventes mensuelles pour l'année en cours"}
                    {period === 'daily' && "Évolution des ventes journalières pour la semaine en cours"}
                    {period === 'weekly' && "Évolution des ventes hebdomadaires pour le mois en cours"}
                    {period === 'yearly' && "Évolution des ventes annuelles pour les 5 dernières années"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[400px] w-full p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={period === 'daily' ? salesAnalytics.dailySales : salesAnalytics.monthlySales}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey={period === 'daily' ? 'day' : 'month'}
                          className="text-xs text-muted-foreground"
                        />
                        <YAxis
                          className="text-xs text-muted-foreground"
                          tickFormatter={(value) => `${value/1000}k`}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        {period === 'daily' ? payload[0].payload.day : payload[0].payload.month}
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
                        <Line
                          type="monotone"
                          dataKey="amount"
                          strokeWidth={2}
                          className="stroke-primary"
                          activeDot={{ className: "fill-primary stroke-background stroke-2 r-4" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Produits les plus vendus</CardTitle>
                    <CardDescription>
                      Top 5 des produits par volume de vente
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[400px] w-full p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={salesAnalytics.topProducts}
                          layout="vertical"
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" className="text-xs text-muted-foreground" />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            className="text-xs text-muted-foreground"
                            width={150}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                          Produit
                                        </span>
                                        <span className="font-bold text-muted-foreground">
                                          {payload[0].payload.name}
                                        </span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                          Quantité
                                        </span>
                                        <span className="font-bold text-muted-foreground">
                                          {payload[0].value}
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
                            dataKey="quantity" 
                            fill="hsl(var(--primary))" 
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Ventes par marque</CardTitle>
                    <CardDescription>
                      Répartition des ventes par marque
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[400px] w-full p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={brandSalesData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {brandSalesData.map((entry, index) => (
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
                                          Marque
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
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performances des produits</CardTitle>
                  <CardDescription>
                    Analyse détaillée de performance par produit
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left font-medium text-sm">Produit</th>
                          <th className="px-4 py-3 text-left font-medium text-sm">Marque</th>
                          <th className="px-4 py-3 text-right font-medium text-sm">Quantité vendue</th>
                          <th className="px-4 py-3 text-right font-medium text-sm">CA généré</th>
                          <th className="px-4 py-3 text-right font-medium text-sm">Marge brute</th>
                          <th className="px-4 py-3 text-right font-medium text-sm">Stock actuel</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesAnalytics.topProducts.map((product) => {
                          const productDetails = products.find(p => p.id === product.productId);
                          return (
                            <tr key={product.productId} className="border-b">
                              <td className="px-4 py-3">{product.name}</td>
                              <td className="px-4 py-3">{productDetails ? getBrandName(productDetails.brand) : 'N/A'}</td>
                              <td className="px-4 py-3 text-right">{product.quantity}</td>
                              <td className="px-4 py-3 text-right">
                                {productDetails 
                                  ? (product.quantity * productDetails.sellingPriceWithTax).toLocaleString() 
                                  : 'N/A'} XOF
                              </td>
                              <td className="px-4 py-3 text-right">
                                {productDetails 
                                  ? (product.quantity * (productDetails.sellingPriceExcludingTax - productDetails.purchasePrice)).toLocaleString() 
                                  : 'N/A'} XOF
                              </td>
                              <td className="px-4 py-3 text-right">
                                {productDetails ? productDetails.stock : 'N/A'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Tendance des ventes</CardTitle>
                    <CardDescription>
                      Évolution des ventes sur les 12 derniers mois
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[300px] w-full p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={salesAnalytics.monthlySales}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis
                            dataKey="month"
                            className="text-xs text-muted-foreground"
                          />
                          <YAxis
                            className="text-xs text-muted-foreground"
                            tickFormatter={(value) => `${value/1000}k`}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                          {payload[0].payload.month}
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
                          <Line
                            type="monotone"
                            dataKey="amount"
                            strokeWidth={2}
                            className="stroke-primary"
                            activeDot={{ className: "fill-primary stroke-background stroke-2 r-4" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Analyse des performances</CardTitle>
                    <CardDescription>
                      Indicateurs de performance clés
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Taux de conversion</span>
                          <span className="font-medium">65%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width: '65%' }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Rotation des stocks</span>
                          <span className="font-medium">4.2</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width: '70%' }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Marge bénéficiaire</span>
                          <span className="font-medium">28.5%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width: '28.5%' }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Retour client</span>
                          <span className="font-medium">4.8/5</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width: '96%' }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Prévisions de ventes</CardTitle>
                  <CardDescription>
                    Estimation des ventes pour les prochains mois
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px] w-full p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 10,
                        }}
                        data={[
                          { month: 'Nov', actual: 0, forecast: 1900000 },
                          { month: 'Déc', actual: 0, forecast: 2100000 },
                          { month: 'Jan', actual: 0, forecast: 1800000 },
                          { month: 'Fév', actual: 0, forecast: 1950000 },
                        ]}
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
                                        {payload[0].payload.month}
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
                        <Line
                          type="monotone"
                          dataKey="forecast"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          className="stroke-primary"
                          activeDot={{ className: "fill-primary stroke-background stroke-2 r-4" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
