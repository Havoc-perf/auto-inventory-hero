
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { products, categories, brands, carModels } from '@/utils/dummyData';
import { Product, Category, Brand, CarModel } from '@/utils/types';
import { Pencil, Trash, Plus, Search, FileText, Filter, Package, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const Products = () => {
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    barcode: '',
    category: '',
    brand: '',
    purchasePrice: 0,
    margin: 0,
    stock: 0,
    compatibleCars: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = value;
    
    // Convert numeric inputs to numbers
    if (['purchasePrice', 'margin', 'stock'].includes(name)) {
      newValue = Number(value);
    }
    
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const calculateSellingPrices = (purchasePrice: number, margin: number) => {
    const sellingPriceExcludingTax = purchasePrice * (1 + margin / 100);
    const sellingPriceWithTax = sellingPriceExcludingTax * 1.18;
    return { sellingPriceExcludingTax, sellingPriceWithTax };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { sellingPriceExcludingTax, sellingPriceWithTax } = calculateSellingPrices(
      formData.purchasePrice || 0,
      formData.margin || 0
    );
    
    if (editingProduct) {
      // Update existing product
      const updatedProduct = {
        ...editingProduct,
        ...formData,
        sellingPriceExcludingTax,
        sellingPriceWithTax
      };
      
      setProductsList(productsList.map(p => p.id === editingProduct.id ? updatedProduct : p));
      toast.success('Produit mis à jour avec succès');
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name || 'Nouveau produit',
        barcode: formData.barcode || '0000000000000',
        category: formData.category || '',
        brand: formData.brand || '',
        compatibleCars: formData.compatibleCars || [],
        purchasePrice: formData.purchasePrice || 0,
        margin: formData.margin || 0,
        sellingPriceExcludingTax,
        sellingPriceWithTax,
        stock: formData.stock || 0
      };
      
      setProductsList([...productsList, newProduct]);
      toast.success('Produit ajouté avec succès');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      barcode: '',
      category: '',
      brand: '',
      purchasePrice: 0,
      margin: 0,
      stock: 0,
      compatibleCars: []
    });
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      barcode: product.barcode,
      category: product.category,
      brand: product.brand,
      purchasePrice: product.purchasePrice,
      margin: product.margin,
      stock: product.stock,
      compatibleCars: product.compatibleCars
    });
    setIsAddingProduct(true);
  };

  const handleDelete = (id: string) => {
    setProductsList(productsList.filter(product => product.id !== id));
    toast.success('Produit supprimé avec succès');
  };

  const filteredProducts = productsList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.barcode.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const getCategoryName = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : 'Non catégorisé';
  };

  const getBrandName = (id: string) => {
    const brand = brands.find(b => b.id === id);
    return brand ? brand.name : 'Non spécifié';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Produits</h2>
            <p className="text-muted-foreground">Gérez votre catalogue de produits</p>
          </div>
          <Button onClick={() => setIsAddingProduct(true)}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
          </Button>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <TabsList>
              <TabsTrigger value="list" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Liste
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Grille
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={brandFilter} onValueChange={(value) => setBrandFilter(value)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Toutes marques" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes marques</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left font-medium text-sm">Nom</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Code barre</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Catégorie</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Marque</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Prix d'achat</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Marge</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Prix HT</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Prix TTC</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Stock</th>
                        <th className="px-4 py-3 text-center font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className="px-4 py-3">{product.name}</td>
                          <td className="px-4 py-3">{product.barcode}</td>
                          <td className="px-4 py-3">{getCategoryName(product.category)}</td>
                          <td className="px-4 py-3">{getBrandName(product.brand)}</td>
                          <td className="px-4 py-3">{product.purchasePrice.toLocaleString()} XOF</td>
                          <td className="px-4 py-3">{product.margin}%</td>
                          <td className="px-4 py-3">{product.sellingPriceExcludingTax.toLocaleString()} XOF</td>
                          <td className="px-4 py-3">{product.sellingPriceWithTax.toLocaleString()} XOF</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              product.stock <= 10 ? 'bg-red-100 text-red-800' : 
                              product.stock <= 20 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => handleEdit(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-destructive" 
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grid" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img 
                      src={product.image || "https://placehold.co/300x300?text=Product"} 
                      alt={product.name}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-1">
                      <h3 className="font-medium line-clamp-1">{product.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{getBrandName(product.brand)}</span>
                        <span className="mx-1">•</span>
                        <span>{getCategoryName(product.category)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="font-medium">{product.sellingPriceWithTax.toLocaleString()} XOF</div>
                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                          product.stock <= 10 ? 'bg-red-100 text-red-800' : 
                          product.stock <= 20 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          Stock: {product.stock}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="flex border-t divide-x">
                    <Button 
                      variant="ghost" 
                      className="flex-1 rounded-none h-10"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-4 w-4 mr-2" /> Modifier
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex-1 rounded-none h-10 text-destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" /> Supprimer
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Modifier un produit' : 'Ajouter un produit'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? 'Mettez à jour les informations du produit ci-dessous.' 
                : 'Remplissez les informations du produit ci-dessous.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Code barre</Label>
                <Input 
                  id="barcode" 
                  name="barcode" 
                  value={formData.barcode} 
                  onChange={handleInputChange} 
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
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Marque</Label>
                <Select 
                  value={formData.brand} 
                  onValueChange={(value) => handleSelectChange('brand', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="margin">Marge (%)</Label>
                <Input 
                  id="margin" 
                  name="margin" 
                  type="number" 
                  value={formData.margin} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock initial</Label>
                <Input 
                  id="stock" 
                  name="stock" 
                  type="number" 
                  value={formData.stock} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Prix calculés</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md border p-2">
                    <div className="text-xs text-muted-foreground">Prix HT</div>
                    <div className="font-medium">
                      {calculateSellingPrices(
                        formData.purchasePrice || 0, 
                        formData.margin || 0
                      ).sellingPriceExcludingTax.toLocaleString()} XOF
                    </div>
                  </div>
                  <div className="rounded-md border p-2">
                    <div className="text-xs text-muted-foreground">Prix TTC</div>
                    <div className="font-medium">
                      {calculateSellingPrices(
                        formData.purchasePrice || 0, 
                        formData.margin || 0
                      ).sellingPriceWithTax.toLocaleString()} XOF
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Véhicules compatibles</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Fonctionnalité à venir
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Annuler
              </Button>
              <Button type="submit">
                {editingProduct ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Products;
