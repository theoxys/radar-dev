import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, signIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-[992px] mx-auto">
        <div className="text-center py-8">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-[992px] mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Autenticação Necessária</CardTitle>
            <CardDescription>
              Você precisa estar logado para compartilhar informações de trabalho.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={signIn} className="w-full">
              Entrar com Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
