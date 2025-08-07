import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, LogOut, User } from "lucide-react";
import { useAuth } from "./AuthProvider";

export function Header() {
  const { user, isAuthenticated, signIn, signOut, isLoading } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 max-w-[992px]">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            RadarDev
          </Link>
          
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/submit">
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Compartilhar Dados
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.picture} alt={user?.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={signIn} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? "Carregando..." : "Entrar com Google"}
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
