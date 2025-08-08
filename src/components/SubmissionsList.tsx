import React from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Slider } from "../components/ui/slider";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { TechStackFilter } from "./TechStackFilter";
import { useGetSubmissions } from "../hooks/useSubmissionts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { SubmissionCard } from "./SubmissionCard";
import { HeroSection } from "./HeroSection";
import { useFiltersContext } from "@/context/FiltersContext";

export function SubmissionsList() {
  const {
    filters,
    setFilters,
    searchInput,
    setSearchInput,
    salaryRange,
    setSalaryRange,
    selectedTechnologies,
    setSelectedTechnologies,
    applyFilters,
    clearFilters,
  } = useFiltersContext();

  const { data, isLoading, error } = useGetSubmissions(filters);

  const handleApplyFilters = () => applyFilters();

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erro ao carregar as submissões. Tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1330px] mx-auto space-y-8">
      <HeroSection />

      <div className="flex w-full flex-col md:flex-row gap-4 items-start">
        {/* Filters */}
        <Card className="w-full md:max-w-[350px] md:sticky md:top-20 md:self-start">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
            {/* Results Count */}
            {data && (
              <div className="text-start">
                <Badge variant="secondary">{data.total} submissões encontradas</Badge>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sort */}
            <div className="space-y-2">
              <Label htmlFor="sort">Ordenar por</Label>
              <Select
                value={filters.sort ?? "recent"}
                onValueChange={(value) => setFilters((p) => ({ ...p, sort: value as any, page: 1 }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ordenação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="oldest">Mais antigos</SelectItem>
                  <SelectItem value="salary_desc">Maiores salários</SelectItem>
                  <SelectItem value="salary_asc">Menores salários</SelectItem>
                  <SelectItem value="alpha">Ordem alfabética</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              <Label>
                Faixa Salarial: ${(salaryRange[0] / 100).toLocaleString()} - ${(salaryRange[1] / 100).toLocaleString()}
              </Label>
              <div className="py-2">
                <Slider
                  value={salaryRange}
                  onValueChange={setSalaryRange as any}
                  max={5000000} // $50,000 em centavos
                  min={0}
                  step={50000} // $500 em centavos
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
            <div className="flex items-center gap-3">
              <Button onClick={clearFilters} variant="outline" className="flex-1">
                Limpar Filtros
              </Button>
              <Button onClick={handleApplyFilters} className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-8">
            <p>Carregando submissões...</p>
          </div>
        ) : (data?.items?.length ?? 0) === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma submissão encontrada com os filtros aplicados.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-full gap-4 pb-6">
              {data?.items.map((submission) => (
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
