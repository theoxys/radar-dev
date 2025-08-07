import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import backend from "~backend/client";
import type { ListSubmissionsRequest } from "~backend/submissions/types";
import { SubmissionCard } from "./SubmissionCard";

export function SubmissionsList() {
  const [filters, setFilters] = useState<ListSubmissionsRequest>({
    page: 1,
    perPage: 20,
    q: "",
    salaryMin: 0,
    salaryMax: 50000,
  });

  const [searchInput, setSearchInput] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 50000]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["submissions", filters],
    queryFn: () => backend.submissions.list(filters),
  });

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      q: searchInput,
      page: 1,
    }));
  };

  const handleSalaryFilter = () => {
    setFilters(prev => ({
      ...prev,
      salaryMin: salaryRange[0],
      salaryMax: salaryRange[1],
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setSalaryRange([0, 50000]);
    setFilters({
      page: 1,
      perPage: 20,
      q: "",
      salaryMin: 0,
      salaryMax: 50000,
    });
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erro ao carregar as submissões. Tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Informações de Trabalho Compartilhadas
        </h1>
        <p className="text-gray-600">
          Explore dados reais de salários e benefícios compartilhados anonimamente
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar por empresa ou cargo</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Ex: Google, Desenvolvedor"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Faixa Salarial: R$ {salaryRange[0].toLocaleString()} - R$ {salaryRange[1].toLocaleString()}</Label>
              <div className="px-2">
                <Slider
                  value={salaryRange}
                  onValueChange={setSalaryRange}
                  max={50000}
                  min={0}
                  step={500}
                  className="w-full"
                />
              </div>
              <Button onClick={handleSalaryFilter} variant="outline" className="w-full">
                Aplicar Filtro de Salário
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button onClick={clearFilters} variant="outline">
              Limpar Filtros
            </Button>
            
            {data && (
              <Badge variant="secondary">
                {data.total} submissões encontradas
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando submissões...</p>
        </div>
      ) : data?.submissions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhuma submissão encontrada com os filtros aplicados.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {data?.submissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Button
                onClick={() => handlePageChange(data.page - 1)}
                disabled={data.page === 1}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <span className="text-sm text-gray-600">
                Página {data.page} de {data.totalPages}
              </span>
              
              <Button
                onClick={() => handlePageChange(data.page + 1)}
                disabled={data.page === data.totalPages}
                variant="outline"
                size="sm"
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
