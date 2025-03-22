
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Users,
  BarChart,
  ReceiptText,
  Settings,
  Warehouse,
  CreditCard,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navigationItems = [
    {
      title: 'Tableau de bord',
      href: '/dashboard',
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      forRoles: ['admin', 'seller']
    },
    {
      title: 'Produits',
      href: '/products',
      icon: <Package className="mr-2 h-4 w-4" />,
      forRoles: ['admin', 'seller']
    },
    {
      title: 'Stock',
      href: '/inventory',
      icon: <Warehouse className="mr-2 h-4 w-4" />,
      forRoles: ['admin', 'seller']
    },
    {
      title: 'Caisse',
      href: '/pos',
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
      forRoles: ['admin', 'seller']
    },
    {
      title: 'Factures',
      href: '/invoices',
      icon: <FileText className="mr-2 h-4 w-4" />,
      forRoles: ['admin', 'seller']
    },
    {
      title: 'Clients',
      href: '/customers',
      icon: <Users className="mr-2 h-4 w-4" />,
      forRoles: ['admin', 'seller']
    },
    {
      title: 'Analyses',
      href: '/analytics',
      icon: <BarChart className="mr-2 h-4 w-4" />,
      forRoles: ['admin']
    },
    {
      title: 'Finances',
      href: '/finance',
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      forRoles: ['admin']
    },
    {
      title: 'Proforma',
      href: '/proforma',
      icon: <ReceiptText className="mr-2 h-4 w-4" />,
      forRoles: ['admin', 'seller']
    },
    {
      title: 'Paramètres',
      href: '/settings',
      icon: <Settings className="mr-2 h-4 w-4" />,
      forRoles: ['admin']
    }
  ];

  // Filter items based on user role
  const filteredItems = isAdmin 
    ? navigationItems 
    : navigationItems.filter(item => item.forRoles.includes('seller'));

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-72 border-r border-border bg-card flex-col transition-transform duration-300 ease-in-out md:flex md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-lg font-semibold">Auto Parts Manager</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-3 md:hidden" 
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {filteredItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary",
                  location.pathname === item.href
                    ? "bg-secondary text-secondary-foreground"
                    : "text-foreground/60 hover:text-foreground"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Auto Parts Manager
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
