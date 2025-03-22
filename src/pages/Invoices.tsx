
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { invoices, customers } from '@/utils/dummyData';
import { Invoice } from '@/utils/types';
import { Search, FileText, FileDown, Printer, Eye, Filter, Download } from 'lucide-react';
import { toast } from 'sonner';

const Invoices = () => {
  const [invoicesList, setInvoicesList] = useState<Invoice[]>(invoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [invoiceType, setInvoiceType] = useState<'all' | 'sale' | 'proforma'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetails(true);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    toast.success(`Impression de la facture ${invoice.id} en cours...`);
    // In a real application, this would trigger a print function
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success(`Téléchargement de la facture ${invoice.id} en cours...`);
    // In a real application, this would trigger a download function
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    const updatedInvoices = invoicesList.map((invoice) => {
      if (invoice.id === invoiceId) {
        return { ...invoice, paid: true };
      }
      return invoice;
    });
    
    setInvoicesList(updatedInvoices);
    toast.success(`Facture ${invoiceId} marquée comme payée`);
    
    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice({ ...selectedInvoice, paid: true });
    }
  };

  const getCustomerName = (id: string | null) => {
    if (!id) return 'Client non spécifié';
    const customer = customers.find(c => c.id === id);
    return customer ? customer.name : 'Client inconnu';
  };

  const filteredInvoices = invoicesList.filter((invoice) => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.customer && getCustomerName(invoice.customer).toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = invoiceType === 'all' || invoice.type === invoiceType;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'paid' && invoice.paid) || 
      (statusFilter === 'unpaid' && !invoice.paid);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Factures</h2>
            <p className="text-muted-foreground">Gérez vos factures et factures proforma</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Nouvelle facture
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Tabs 
            defaultValue="all" 
            className="w-full"
            value={invoiceType}
            onValueChange={(value) => setInvoiceType(value as 'all' | 'sale' | 'proforma')}
          >
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="sale">Factures</TabsTrigger>
              <TabsTrigger value="proforma">Proforma</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par numéro ou client..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="shrink-0" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
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
                    <th className="px-4 py-3 text-left font-medium text-sm">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-sm">Statut</th>
                    <th className="px-4 py-3 text-center font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                        Aucune facture trouvée
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
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            invoice.type === 'proforma' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {invoice.type === 'proforma' ? 'Proforma' : 'Facture'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            invoice.paid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {invoice.paid ? 'Payée' : 'Non payée'}
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
                              <Download className="h-4 w-4" />
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

      <Dialog open={showInvoiceDetails} onOpenChange={setShowInvoiceDetails}>
        {selectedInvoice && (
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>
                  {selectedInvoice.type === 'proforma' ? 'Facture Proforma' : 'Facture'} - {selectedInvoice.id}
                </span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  selectedInvoice.paid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedInvoice.paid ? 'Payée' : 'Non payée'}
                </span>
              </DialogTitle>
              <DialogDescription>
                Détails de la facture du {selectedInvoice.date}
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
                          <td className="px-2 py-2 text-sm text-right">{item.unitPrice.toLocaleString()} XOF</td>
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
                <p>Conditions de paiement: Paiement à réception de la facture</p>
                <p>Merci pour votre confiance!</p>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              {!selectedInvoice.paid && (
                <Button onClick={() => handleMarkAsPaid(selectedInvoice.id)}>
                  Marquer comme payée
                </Button>
              )}
              <Button variant="outline" onClick={() => handlePrintInvoice(selectedInvoice)}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
              <Button variant="outline" onClick={() => handleDownloadInvoice(selectedInvoice)}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default Invoices;
