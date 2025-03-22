
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { products, customers, users } from '@/utils/dummyData';
import { Product, Customer, InvoiceItem, Invoice } from '@/utils/types';
import { Search, ShoppingCart, Plus, Minus, Trash, Receipt, UserPlus, X, CreditCard, Printer, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const POS = () => {
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [customersList, setCustomersList] = useState<Customer[]>(customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<InvoiceItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    loyaltyPoints: 0,
    totalPurchases: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error('Le nom et le téléphone sont requis');
      return;
    }
    
    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      address: newCustomer.address,
      loyaltyPoints: 0,
      totalPurchases: 0
    };
    
    setCustomersList([...customersList, customer]);
    setSelectedCustomer(customer.id);
    setIsAddingCustomer(false);
    
    toast.success('Client ajouté avec succès');
    
    // Reset form
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      loyaltyPoints: 0,
      totalPurchases: 0
    });
  };

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      const updatedItems = cartItems.map(item => {
        if (item.productId === product.id) {
          return {
            ...item,
            quantity: item.quantity + 1,
            total: (item.quantity + 1) * item.unitPrice
          };
        }
        return item;
      });
      setCartItems(updatedItems);
    } else {
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.sellingPriceWithTax,
        total: product.sellingPriceWithTax,
        taxIncluded: true
      };
      setCartItems([...cartItems, newItem]);
    }
    
    toast.success(`${product.name} ajouté au panier`);
  };

  const updateQuantity = (itemId: string, change: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return {
          ...item,
          quantity: newQuantity,
          total: newQuantity * item.unitPrice
        };
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedCustomer(null);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Le panier est vide');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate subtotal and tax
      const subtotal = cartItems.reduce((sum, item) => sum + (item.total / 1.18), 0);
      const tax = cartItems.reduce((sum, item) => sum + (item.total - item.total / 1.18), 0);
      const total = cartItems.reduce((sum, item) => sum + item.total, 0);
      
      // Create invoice
      const invoice: Invoice = {
        id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        customer: selectedCustomer,
        items: cartItems,
        subtotal,
        tax,
        total,
        paid: true,
        type: 'sale',
        createdBy: users[0].id // Assume the first user (admin) creates the invoice
      };
      
      // Update product stock
      const updatedProducts = productsList.map(product => {
        const cartItem = cartItems.find(item => item.productId === product.id);
        if (cartItem) {
          return {
            ...product,
            stock: product.stock - cartItem.quantity
          };
        }
        return product;
      });
      
      // Update customer if selected
      if (selectedCustomer) {
        const updatedCustomers = customersList.map(customer => {
          if (customer.id === selectedCustomer) {
            return {
              ...customer,
              loyaltyPoints: customer.loyaltyPoints + Math.floor(total / 1000), // 1 point per 1000 XOF
              lastPurchase: invoice.date,
              totalPurchases: customer.totalPurchases + 1
            };
          }
          return customer;
        });
        setCustomersList(updatedCustomers);
      }
      
      setProductsList(updatedProducts);
      
      // Simulate printing receipt
      if (isPrinting) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      toast.success('Vente enregistrée avec succès');
      clearCart();
      setIsCheckingOut(false);
    } catch (error) {
      toast.error('Une erreur est survenue lors de la vente');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = productsList.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm)
    ) && product.stock > 0;
  });

  const cartTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getCustomerName = (id: string | null) => {
    if (!id) return 'Client non spécifié';
    const customer = customersList.find(c => c.id === id);
    return customer ? customer.name : 'Client inconnu';
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Products Section */}
          <div className="lg:w-2/3 space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Caisse</h2>
                <p className="text-muted-foreground">Enregistrez vos ventes rapidement</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un produit ou scanner code-barre..."
                  className="pl-8 w-full md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow"
                  onClick={() => addToCart(product)}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img 
                      src={product.image || "https://placehold.co/300x300?text=Product"} 
                      alt={product.name}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-1">
                      <h3 className="font-medium line-clamp-1">{product.name}</h3>
                      <div className="text-sm text-muted-foreground line-clamp-1">Stock: {product.stock}</div>
                      <div className="font-medium text-lg">{product.sellingPriceWithTax.toLocaleString()} XOF</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:w-1/3 space-y-4">
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Panier ({cartItemsCount})
                  </CardTitle>
                  {cartItems.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs" 
                      onClick={clearCart}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Vider
                    </Button>
                  )}
                </div>
                <CardDescription>
                  {selectedCustomer ? (
                    <div className="flex items-center justify-between">
                      <span>Client: {getCustomerName(selectedCustomer)}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs" 
                        onClick={() => setSelectedCustomer(null)}
                      >
                        Changer
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>Client: Non spécifié</span>
                      <div className="flex gap-1">
                        <Select onValueChange={setSelectedCustomer}>
                          <SelectTrigger className="h-7 text-xs w-[140px]">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {customersList.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-xs" 
                          onClick={() => setIsAddingCustomer(true)}
                        >
                          <UserPlus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
                    <p className="text-muted-foreground">Votre panier est vide</p>
                    <p className="text-xs text-muted-foreground">Cliquez sur un produit pour l'ajouter au panier</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{item.productName}</p>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-5 text-center">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{item.total.toLocaleString()} XOF</p>
                          <p className="text-xs text-muted-foreground">
                            {item.unitPrice.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-2 border-t">
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Sous-total HT:</span>
                    <span>{(cartTotal / 1.18).toFixed(0).toLocaleString()} XOF</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>TVA (18%):</span>
                    <span>{(cartTotal - cartTotal / 1.18).toFixed(0).toLocaleString()} XOF</span>
                  </div>
                  <div className="flex items-center justify-between font-medium text-lg">
                    <span>Total TTC:</span>
                    <span>{cartTotal.toLocaleString()} XOF</span>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  size="lg"
                  disabled={cartItems.length === 0}
                  onClick={() => setIsCheckingOut(true)}
                >
                  <Receipt className="mr-2 h-5 w-5" />
                  Passer à la caisse
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckingOut} onOpenChange={setIsCheckingOut}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Finaliser la vente</DialogTitle>
            <DialogDescription>
              Vérifiez les détails de la vente et procédez au paiement.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Détails du client</h3>
                <p className="text-sm">{getCustomerName(selectedCustomer)}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Articles ({cartItemsCount})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <span>{item.productName}</span>
                        <span className="text-muted-foreground"> × {item.quantity}</span>
                      </div>
                      <span>{item.total.toLocaleString()} XOF</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Sous-total HT:</span>
                  <span>{(cartTotal / 1.18).toFixed(0).toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>TVA (18%):</span>
                  <span>{(cartTotal - cartTotal / 1.18).toFixed(0).toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total TTC:</span>
                  <span>{cartTotal.toLocaleString()} XOF</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Méthode de paiement</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Espèces
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Carte
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="print-receipt"
                  checked={isPrinting}
                  onChange={() => setIsPrinting(!isPrinting)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="print-receipt" className="text-sm cursor-pointer">
                  Imprimer le reçu
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCheckingOut(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleCheckout}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Terminer la vente
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un client</DialogTitle>
            <DialogDescription>
              Entrez les informations du nouveau client.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du client</Label>
              <Input 
                id="name" 
                name="name" 
                value={newCustomer.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={newCustomer.phone} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={newCustomer.email} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input 
                id="address" 
                name="address" 
                value={newCustomer.address} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddingCustomer(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddCustomer}>
              Ajouter le client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default POS;
