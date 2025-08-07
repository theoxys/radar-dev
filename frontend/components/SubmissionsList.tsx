import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { TechStackFilter } from "./TechStackFilter";
import backend from "~backend/client";
import type { ListSubmissionsRequest, Technology } from "~backend/submissions/types";
import { SubmissionCard } from "./SubmissionCard";

export function SubmissionsList() {
  const [filters, setFilters] = useState<ListSubmissionsRequest>({
    page: 1,
    perPage: 20,
    q: "",
    salaryMin: 0,
    salaryMax: 50000,
    technologyIds: [],
  });

  const [searchInput, setSearchInput] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 50000]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<Technology[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["submissions", filters],
    queryFn: () => backend.submissions.list(filters),
  });

  const handleApplyFilters = () => {
    setFilters(prev => ({
      ...prev,
      q: searchInput,
      salaryMin: salaryRange[0],
      salaryMax: salaryRange[1],
      technologyIds: selectedTechnologies.map(tech => tech.id),
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setSalaryRange([0, 50000]);
    setSelectedTechnologies([]);
    setFilters({
      page: 1,
      perPage: 20,
      q: "",
      salaryMin: 0,
      salaryMax: 50000,
      technologyIds: [],
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
    <div className="max-w-[992px] mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Informações de Trabalho Compartilhadas
        </h1>
        <p className="text-muted-foreground">
          Explore dados reais de salários e benefícios compartilhados anonimamente
        </p>
      </div>

			<div className="flex flex-col md:flex-row gap-2 items-start">

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar por empresa ou cargo</Label>
            <Input
              id="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Ex: Google, Desenvolvedor"
              onKeyPress={(e) => e.key === "Enter" && handleApplyFilters()}
            />
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            <Label>Faixa Salarial: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}</Label>
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
          </div>

          {/* Tech Stack Filter */}
          <TechStackFilter
            selectedTechnologies={selectedTechnologies}
            onTechnologiesChange={setSelectedTechnologies}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 justify-between">
            {/* Results Count */}
            {data && (
              <div className="text-center">
                <Badge variant="secondary">
                  {data.total} submissões encontradas
                </Badge>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Button onClick={clearFilters} variant="outline" className="flex w-fit max-w-100">
                Limpar Filtros
              </Button>
              <Button onClick={handleApplyFilters} className="flex w-fit max-w-100">
                <Search className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
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
          <p className="text-muted-foreground">Nenhuma submissão encontrada com os filtros aplicados.</p>
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
              
              <span className="text-sm text-muted-foreground">
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

    </div>
  );
}
