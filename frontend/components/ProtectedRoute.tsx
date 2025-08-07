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
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para manter a qualidade dos dados e evitar spam, é necessário fazer login com sua conta Google.
              Seus dados pessoais não serão compartilhados publicamente.
            </p>
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
