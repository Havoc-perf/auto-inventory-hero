
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { customers } from '@/utils/dummyData';
import { Customer } from '@/utils/types';
import { UserPlus, Search, Edit, Trash, User, Phone, Mail, MapPin, Star, CalendarCheck, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const Customers = () => {
  const [customersList, setCustomersList] = useState<Customer[]>(customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    loyaltyPoints: 0,
    totalPurchases: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Le nom et le téléphone sont requis');
      return;
    }
    
    if (editingCustomer) {
      // Update existing customer
      const updatedCustomer = {
        ...editingCustomer,
        ...formData
      };
      
      setCustomersList(customersList.map(c => c.id === editingCustomer.id ? updatedCustomer : c));
      toast.success('Client mis à jour avec succès');
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: formData.name || '',
        phone: formData.phone || '',
        email: formData.email,
        address: formData.address,
        loyaltyPoints: formData.loyaltyPoints || 0,
        totalPurchases: formData.totalPurchases || 0
      };
      
      setCustomersList([...customersList, newCustomer]);
      toast.success('Client ajouté avec succès');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      loyaltyPoints: 0,
      totalPurchases: 0
    });
    setIsAddingCustomer(false);
    setEditingCustomer(null);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      loyaltyPoints: customer.loyaltyPoints,
      totalPurchases: customer.totalPurchases
    });
    setIsAddingCustomer(true);
  };

  const handleDelete = (id: string) => {
    setCustomersList(customersList.filter(customer => customer.id !== id));
    toast.success('Client supprimé avec succès');
  };

  const filteredCustomers = customersList.filter(customer => {
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
            <p className="text-muted-foreground">Gérez votre base de données clients</p>
          </div>
          <Button onClick={() => setIsAddingCustomer(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Ajouter un client
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un client..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 text-center py-10">
              <User className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="mt-2 text-lg font-medium">Aucun client trouvé</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Commencez par ajouter un client ou modifiez votre recherche.
              </p>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <Card key={customer.id} className="overflow-hidden">
                <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>{customer.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1" /> {customer.phone}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(customer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(customer.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2 text-sm">
                    {customer.email && (
                      <div className="flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        <span>{customer.address}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Star className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      <span>Points de fidélité: {customer.loyaltyPoints}</span>
                    </div>
                    <div className="flex items-center">
                      <ShoppingBag className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      <span>Achats totaux: {customer.totalPurchases}</span>
                    </div>
                    {customer.lastPurchase && (
                      <div className="flex items-center">
                        <CalendarCheck className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        <span>Dernier achat: {customer.lastPurchase}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? 'Modifier un client' : 'Ajouter un client'}
            </DialogTitle>
            <DialogDescription>
              {editingCustomer 
                ? 'Mettez à jour les informations du client ci-dessous.' 
                : 'Remplissez les informations du client ci-dessous.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du client</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
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
                  value={formData.email} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                />
              </div>
              {editingCustomer && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loyaltyPoints">Points de fidélité</Label>
                    <Input 
                      id="loyaltyPoints" 
                      name="loyaltyPoints" 
                      type="number" 
                      value={formData.loyaltyPoints} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalPurchases">Nombre d'achats</Label>
                    <Input 
                      id="totalPurchases" 
                      name="totalPurchases" 
                      type="number" 
                      value={formData.totalPurchases} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Annuler
              </Button>
              <Button type="submit">
                {editingCustomer ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Customers;
