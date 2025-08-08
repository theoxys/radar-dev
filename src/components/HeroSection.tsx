import { DollarSign, TrendingUp, Users } from "lucide-react";
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "./ui/card";

export function HeroSection() {
  return (
    <div>
      <div className="space-y-8 z-20">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Descubra o mercado global de tecnologia</h1>
          <h2 className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Saiba quanto ganham devs brasileiros em empresas gringas e encontre as melhores oportunidades para alavancar
            sua carreira.
          </h2>
        </div>

        {/* Benefits Cards */}
        <div className="space-y-4">
          <div className="hidden md:grid md:grid-cols-3 gap-4">
            <Card className="text-center gap-2">
              <CardHeader>
                <div className="mx-auto mb-2 p-2 bg-green-100 dark:bg-green-900/20 rounded-full w-fit">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Transparência salarial</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Consulte salários reais informados anonimamente por profissionais como você.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center gap-2">
              <CardHeader>
                <div className="mx-auto mb-2 p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full w-fit">
                  <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Benchmark de carreira</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compare seu salário e benefícios com o mercado global para negociar melhor.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center gap-2">
              <CardHeader>
                <div className="mx-auto mb-2 p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full w-fit">
                  <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg">Comunidade colaborativa</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Contribua com suas informações — ajudamos o mercado de desenvolvimento a ser mais justo.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
