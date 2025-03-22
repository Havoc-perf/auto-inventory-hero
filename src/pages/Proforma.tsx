
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { invoices, customers, products } from '@/utils/dummyData';
import { Invoice, Customer, Product, InvoiceItem } from '@/utils/types';
import { Plus, FilePlus, Printer, FileDown, Search, Trash, Eye, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const Proforma = () => {
  const [invoicesList, setInvoicesList] = useState<Invoice[]>(
    invoices.filter(invoice => invoice.type === 'proforma')
  );
  const [customersList, setCustomersList] = useState<Customer[]>(customers);
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [isViewingInvoice, setIsViewingInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<InvoiceItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [taxIncluded, setTaxIncluded] = useState<boolean>(true);

  const resetForm = () => {
    setSelectedCustomer(null);
    setSelectedItems([]);
    setIsCreating(false);
    setSelectedInvoice(null);
  };

  const handleAddItem = () => {
    if (!selectedProduct) {
      toast.error('Veuillez sélectionner un produit');
      return;
    }

    if (quantity <= 0) {
      toast.error('La quantité doit être supérieure à 0');
      return;
    }

    const product = productsList.find(p => p.id === selectedProduct);
    
    if (!product) {
      toast.error('Produit non trouvé');
      return;
    }

    const unitPrice = taxIncluded ? product.sellingPriceWithTax : product.sellingPriceExcludingTax;
    
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice,
      total: unitPrice * quantity,
      taxIncluded
    };

    setSelectedItems([...selectedItems, newItem]);
    setIsAddingItem(false);
    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const handleCreateProforma = () => {
    if (!selectedCustomer) {
      toast.error('Veuillez sélectionner un client');
      return;
    }

    if (selectedItems.length === 0) {
      toast.error('Veuillez ajouter au moins un article');
      return;
    }

    const subtotal = selectedItems.reduce((sum, item) => {
      if (item.taxIncluded) {
        return sum + (item.total / 1.18);
      }
      return sum + item.total;
    }, 0);

    const tax = selectedItems.reduce((sum, item) => {
      if (item.taxIncluded) {
        return sum + (item.total - item.total / 1.18);
      }
      return 0;
    }, 0);

    const total = selectedItems.reduce((sum, item) => sum + item.total, 0);

    const newInvoice: Invoice = {
      id: `PRO-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      customer: selectedCustomer,
      items: selectedItems,
      subtotal,
      tax,
      total,
      paid: false,
      type: 'proforma',
      createdBy: '1' // Assuming admin creates it
    };

    setInvoicesList([newInvoice, ...invoicesList]);
    toast.success('Facture proforma créée avec succès');
    resetForm();
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewingInvoice(true);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    toast.success(`Impression de la facture ${invoice.id} en cours...`);
    // In a real application, this would trigger a print function
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success(`Téléchargement de la facture ${invoice.id} en cours...`);
    // In a real application, this would trigger a download function
  };

  const handleConvertToInvoice = (invoice: Invoice) => {
    toast.success(`Conversion de la facture proforma ${invoice.id} en facture en cours...`);
    // In a real application, this would convert the proforma to a real invoice
  };

  const getCustomerName = (id: string | null) => {
    if (!id) return 'Client non spécifié';
    const customer = customersList.find(c => c.id === id);
    return customer ? customer.name : 'Client inconnu';
  };

  const filteredInvoices = invoicesList.filter((invoice) => {
    return (
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.customer && getCustomerName(invoice.customer).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Factures Proforma</h2>
            <p className="text-muted-foreground">Créez et gérez vos devis et factures proforma</p>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <FilePlus className="mr-2 h-4 w-4" /> Nouvelle proforma
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="converted">Converties</TabsTrigger>
            </TabsList>

            <div className="flex mt-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher une facture..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </Tabs>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium text-sm">Numéro</th>
                    <th className="px-4 py-3 text-left font-medium text-sm">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-sm">Client</th>
                    <th className="px-4 py-3 text-left font-medium text-sm">Montant</th>
                    <th className="px-4 py-3 text-left font-medium text-sm">Statut</th>
                    <th className="px-4 py-3 text-center font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                        Aucune facture proforma trouvée
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b">
                        <td className="px-4 py-3 font-medium">{invoice.id}</td>
                        <td className="px-4 py-3">{invoice.date}</td>
                        <td className="px-4 py-3">{getCustomerName(invoice.customer)}</td>
                        <td className="px-4 py-3">{invoice.total.toLocaleString()} XOF</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">
                            Proforma
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleViewInvoice(invoice)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handlePrintInvoice(invoice)}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleDownloadInvoice(invoice)}
                            >
                              <FileDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Proforma Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Créer une facture proforma</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer une nouvelle facture proforma.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Client</Label>
              <Select 
                value={selectedCustomer || ''} 
                onValueChange={setSelectedCustomer}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {customersList.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Articles</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAddingItem(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un article
                </Button>
              </div>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-3 py-2 text-left text-xs font-medium">Produit</th>
                      <th className="px-3 py-2 text-center text-xs font-medium">Quantité</th>
                      <th className="px-3 py-2 text-right text-xs font-medium">Prix unitaire</th>
                      <th className="px-3 py-2 text-right text-xs font-medium">Total</th>
                      <th className="px-3 py-2 text-center text-xs font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-3 text-center text-sm text-muted-foreground">
                          Aucun article ajouté
                        </td>
                      </tr>
                    ) : (
                      selectedItems.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="px-3 py-2 text-sm">{item.productName}</td>
                          <td className="px-3 py-2 text-sm text-center">{item.quantity}</td>
                          <td className="px-3 py-2 text-sm text-right">
                            {item.unitPrice.toLocaleString()} XOF
                            <div className="text-xs text-muted-foreground">
                              {item.taxIncluded ? 'TTC' : 'HT'}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-sm text-right">{item.total.toLocaleString()} XOF</td>
                          <td className="px-3 py-2 text-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {selectedItems.length > 0 && (
                    <tfoot>
                      <tr className="border-t">
                        <td colSpan={3} className="px-3 py-2 text-sm font-medium text-right">
                          Total:
                        </td>
                        <td className="px-3 py-2 text-sm font-medium text-right">
                          {selectedItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()} XOF
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetForm}>
              Annuler
            </Button>
            <Button onClick={handleCreateProforma}>
              Créer la proforma
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un article</DialogTitle>
            <DialogDescription>
              Sélectionnez un produit et spécifiez la quantité.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product">Produit</Label>
              <Select 
                value={selectedProduct} 
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  {productsList.filter(p => p.stock > 0).map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - {product.sellingPriceWithTax.toLocaleString()} XOF
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input 
                id="quantity" 
                type="number" 
                min="1"
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price-type">Type de prix</Label>
              <Select 
                value={taxIncluded ? "ttc" : "ht"} 
                onValueChange={(value) => setTaxIncluded(value === "ttc")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type de prix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ttc">Prix TTC</SelectItem>
                  <SelectItem value="ht">Prix HT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddingItem(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddItem}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={isViewingInvoice} onOpenChange={setIsViewingInvoice}>
        {selectedInvoice && (
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                Facture Proforma - {selectedInvoice.id}
              </DialogTitle>
              <DialogDescription>
                Créée le {selectedInvoice.date}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">Client</h3>
                  <p className="text-sm">{getCustomerName(selectedInvoice.customer)}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-medium">Émetteur</h3>
                  <p className="text-sm">Auto Parts Store</p>
                  <p className="text-sm">Cotonou, Bénin</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Articles</h3>
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-2 py-2 text-left text-xs">Produit</th>
                        <th className="px-2 py-2 text-center text-xs">Quantité</th>
                        <th className="px-2 py-2 text-right text-xs">Prix unitaire</th>
                        <th className="px-2 py-2 text-right text-xs">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="px-2 py-2 text-sm">{item.productName}</td>
                          <td className="px-2 py-2 text-sm text-center">{item.quantity}</td>
                          <td className="px-2 py-2 text-sm text-right">
                            {item.unitPrice.toLocaleString()} XOF
                            <div className="text-xs text-muted-foreground">
                              {item.taxIncluded ? 'TTC' : 'HT'}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-sm text-right">{item.total.toLocaleString()} XOF</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Sous-total HT:</span>
                  <span>{selectedInvoice.subtotal.toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>TVA (18%):</span>
                  <span>{selectedInvoice.tax.toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total TTC:</span>
                  <span>{selectedInvoice.total.toLocaleString()} XOF</span>
                </div>
              </div>

              <div className="border-t pt-4 text-xs text-muted-foreground">
                <p>Validité: 30 jours à compter de la date d'émission</p>
                <p>Cette facture proforma n'est pas une facture définitive et ne constitue pas une demande de paiement.</p>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => handleConvertToInvoice(selectedInvoice)}>
                Convertir en facture
              </Button>
              <Button variant="outline" onClick={() => handlePrintInvoice(selectedInvoice)}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
              <Button variant="outline" onClick={() => handleDownloadInvoice(selectedInvoice)}>
                <FileDown className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default Proforma;
