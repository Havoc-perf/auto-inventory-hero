
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { User, Building, Shield, Bell, UserCog, LucideIcon, Upload } from 'lucide-react';

const Settings = () => {
  const { user, companyInfo, updateCompanyInfo } = useAuth();
  
  const [companyName, setCompanyName] = useState(companyInfo.name);
  const [companyLogo, setCompanyLogo] = useState(companyInfo.logo);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [notifications, setNotifications] = useState({
    email: true,
    system: true,
    lowStock: true,
    sales: true
  });

  const handleUpdateCompany = () => {
    if (!companyName.trim()) {
      toast.error('Le nom de l\'entreprise est requis');
      return;
    }
    
    updateCompanyInfo({
      name: companyName,
      logo: companyLogo
    });
  };

  const handleChangePassword = () => {
    if (!password) {
      toast.error('Le mot de passe est requis');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    // In a real app, this would call an API to update the password
    toast.success('Mot de passe mis à jour avec succès');
    setPassword('');
    setConfirmPassword('');
  };

  const handleUpdateNotifications = () => {
    toast.success('Préférences de notification mises à jour');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server
      // For this demo, we'll use a fake URL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCompanyLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  interface SettingsSectionProps {
    icon: LucideIcon;
    title: string;
    description: string;
    children: React.ReactNode;
  }

  const SettingsSection = ({ icon: Icon, title, description, children }: SettingsSectionProps) => (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
          <p className="text-muted-foreground">Gérez les paramètres de votre application</p>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList>
            <TabsTrigger value="company" className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              Entreprise
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Compte
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-6">
            <SettingsSection
              icon={Building}
              title="Informations de l'entreprise"
              description="Mise à jour des informations de votre entreprise"
            >
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="company-name">Nom de l'entreprise</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-logo">Logo de l'entreprise</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={companyLogo} alt={companyName} />
                      <AvatarFallback>{companyName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid w-full max-w-sm gap-1.5">
                      <Label htmlFor="logo-upload">Télécharger un logo</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleUpdateCompany}>
                    Enregistrer les modifications
                  </Button>
                </div>
              </div>
            </SettingsSection>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <SettingsSection
              icon={UserCog}
              title="Informations du compte"
              description="Mise à jour de vos informations personnelles"
            >
              <div className="grid gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    defaultValue={user?.name}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    Enregistrer les modifications
                  </Button>
                </div>
              </div>
            </SettingsSection>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SettingsSection
              icon={Shield}
              title="Sécurité"
              description="Mise à jour de vos paramètres de sécurité"
            >
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input
                    id="current-password"
                    type="password"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleChangePassword}>
                    Mettre à jour le mot de passe
                  </Button>
                </div>
              </div>
            </SettingsSection>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <SettingsSection
              icon={Bell}
              title="Préférences de notification"
              description="Gérez vos préférences de notification"
            >
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications par email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="system-notifications">Notifications système</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications dans l'application
                    </p>
                  </div>
                  <Switch
                    id="system-notifications"
                    checked={notifications.system}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, system: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="low-stock-notifications">Alertes de stock bas</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications lorsque le stock est bas
                    </p>
                  </div>
                  <Switch
                    id="low-stock-notifications"
                    checked={notifications.lowStock}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, lowStock: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sales-notifications">Notifications de vente</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications pour chaque vente
                    </p>
                  </div>
                  <Switch
                    id="sales-notifications"
                    checked={notifications.sales}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sales: checked }))}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleUpdateNotifications}>
                    Enregistrer les préférences
                  </Button>
                </div>
              </div>
            </SettingsSection>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
