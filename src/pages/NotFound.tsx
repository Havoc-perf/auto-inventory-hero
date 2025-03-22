
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1599909631178-f60884aa1b98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
      
      <div className="relative z-10 max-w-md text-center">
        <h1 className="text-9xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page non trouvée</h2>
        <p className="text-lg text-muted-foreground mb-8">
          La page que vous recherchez semble introuvable. Vérifiez l'URL ou retournez à la page d'accueil.
        </p>
        
        <Button asChild size="lg">
          <Link to="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
