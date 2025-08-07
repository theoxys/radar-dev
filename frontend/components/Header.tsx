import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, List } from "lucide-react";

export function Header() {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            JobShare
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                Ver Submissões
              </Button>
            </Link>
            
            <Link to="/submit">
              <Button 
                variant={location.pathname === "/submit" ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Compartilhar Dados
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
