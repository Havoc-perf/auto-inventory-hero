
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { products, stockEntries, users } from '@/utils/dummyData';
import { Product, StockEntry } from '@/utils/types';
import { Plus, Search, PackageCheck, PackagePlus, PackageMinus, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const Inventory = () => {
  const [entries, setEntries] = useState<StockEntry[]>(stockEntries);
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [entryType, setEntryType] = useState<'add' | 'remove'>('add');
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    purchasePrice: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = value;
    
    // Convert numeric inputs to numbers
    if (['quantity', 'purchasePrice'].includes(name)) {
      newValue = Number(value);
    }
    
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSelectChange = (name: string, value: string) => {
    const product = productsList.find(p => p.id === value);
    
    setFormData({ 
      ...formData, 
      [name]: value,
      purchasePrice: product?.purchasePrice || 0 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId) {
      toast.error('Veuillez sélectionner un produit');
      return;
    }
    
    if (formData.quantity <= 0) {
      toast.error('La quantité doit être supérieure à 0');
      return;
    }
    
    // Create new stock entry
    const newEntry: StockEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      productId: formData.productId,
      quantity: formData.quantity,
      purchasePrice: formData.purchasePrice,
      total: formData.quantity * formData.purchasePrice,
      createdBy: users[0].id // Assume first user (admin) creates the entry
    };
    
    // Update stock in products
    const updatedProducts = productsList.map(product => {
      if (product.id === formData.productId) {
        return {
          ...product,
          stock: entryType === 'add' 
            ? product.stock + formData.quantity 
            : product.stock - formData.quantity
        };
      }
      return product;
    });
    
    setEntries([newEntry, ...entries]);
    setProductsList(updatedProducts);
    
    toast.success(
      entryType === 'add' 
        ? `Stock ajouté avec succès (${formData.quantity} unités)` 
        : `Stock retiré avec succès (${formData.quantity} unités)`
    );
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      quantity: 1,
      purchasePrice: 0,
    });
    setIsAddingEntry(false);
  };

  const getProductName = (id: string) => {
    const product = productsList.find(p => p.id === id);
    return product ? product.name : 'Produit inconnu';
  };

  const getUserName = (id: string) => {
    const user = users.find(u => u.id === id);
    return user ? user.name : 'Utilisateur inconnu';
  };

  const filteredEntries = entries.filter(entry => {
    const productName = getProductName(entry.productId).toLowerCase();
    return productName.includes(searchTerm.toLowerCase());
  });

  const filteredProducts = productsList.filter(product => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentStock = productsList.reduce((total, product) => total + product.stock, 0);
  const stockValue = productsList.reduce((total, product) => total + (product.purchasePrice * product.stock), 0);
  const recentEntries = entries.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gestion du stock</h2>
            <p className="text-muted-foreground">Suivez et gérez votre inventaire de produits</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => { setEntryType('add'); setIsAddingEntry(true); }}>
              <PackagePlus className="mr-2 h-4 w-4" /> Entrée de stock
            </Button>
            <Button variant="outline" onClick={() => { setEntryType('remove'); setIsAddingEntry(true); }}>
              <PackageMinus className="mr-2 h-4 w-4" /> Sortie de stock
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Stock total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStock} unités</div>
              <div className="text-xs text-muted-foreground">
                Valeur totale: {stockValue.toLocaleString()} XOF
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Produits en stock faible</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {productsList.filter(p => p.stock <= 10).length} produits
              </div>
              <div className="text-xs text-muted-foreground">
                Nécessitent un réapprovisionnement
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Dernière entrée</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {entries.length > 0 ? new Date(entries[0].date).toLocaleDateString() : 'Aucune entrée'}
              </div>
              <div className="text-xs text-muted-foreground">
                {entries.length > 0 ? `${entries[0].quantity} unités de ${getProductName(entries[0].productId)}` : ''}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="movements" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <TabsList>
              <TabsTrigger value="movements" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Mouvements de stock
              </TabsTrigger>
              <TabsTrigger value="current" className="flex items-center">
                <PackageCheck className="mr-2 h-4 w-4" />
                Stock actuel
              </TabsTrigger>
            </TabsList>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un produit..."
                className="pl-8 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left font-medium text-sm">Date</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Produit</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Quantité</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Prix d'achat</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Total</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Créé par</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEntries.map((entry) => (
                        <tr key={entry.id} className="border-b">
                          <td className="px-4 py-3">{entry.date}</td>
                          <td className="px-4 py-3">{getProductName(entry.productId)}</td>
                          <td className="px-4 py-3">{entry.quantity}</td>
                          <td className="px-4 py-3">{entry.purchasePrice.toLocaleString()} XOF</td>
                          <td className="px-4 py-3">{entry.total.toLocaleString()} XOF</td>
                          <td className="px-4 py-3">{getUserName(entry.createdBy)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="current" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left font-medium text-sm">Produit</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Stock actuel</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Prix d'achat</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Valeur en stock</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className="px-4 py-3">{product.name}</td>
                          <td className="px-4 py-3">{product.stock}</td>
                          <td className="px-4 py-3">{product.purchasePrice.toLocaleString()} XOF</td>
                          <td className="px-4 py-3">{(product.purchasePrice * product.stock).toLocaleString()} XOF</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              product.stock <= 10 ? 'bg-red-100 text-red-800' : 
                              product.stock <= 20 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {product.stock <= 10 ? 'Critique' : product.stock <= 20 ? 'Bas' : 'Normal'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {entryType === 'add' ? 'Entrée de stock' : 'Sortie de stock'}
            </DialogTitle>
            <DialogDescription>
              {entryType === 'add' 
                ? 'Ajoutez des produits à votre inventaire.' 
                : 'Retirez des produits de votre inventaire.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Produit</Label>
                <Select 
                  value={formData.productId} 
                  onValueChange={(value) => handleSelectChange('productId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {productsList.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - Stock: {product.stock}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité</Label>
                <Input 
                  id="quantity" 
                  name="quantity" 
                  type="number" 
                  min="1"
                  value={formData.quantity} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              {entryType === 'add' && (
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Prix d'achat (XOF)</Label>
                  <Input 
                    id="purchasePrice" 
                    name="purchasePrice" 
                    type="number" 
                    value={formData.purchasePrice} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              )}
              {entryType === 'add' && (
                <div className="space-y-2">
                  <Label>Total</Label>
                  <div className="rounded-md border p-2">
                    <div className="font-medium">
                      {(formData.quantity * formData.purchasePrice).toLocaleString()} XOF
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Annuler
              </Button>
              <Button type="submit">
                {entryType === 'add' ? 'Ajouter au stock' : 'Retirer du stock'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Inventory;
