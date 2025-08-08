import React from "react";
import { Link } from "react-router-dom";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { PlusCircle, Search, Sun, Moon } from "lucide-react";
import { useFiltersContext } from "@/context/FiltersContext";
import { TechStackFilter } from "./TechStackFilter";
import { SheetClose } from "../components/ui/sheet";
import { useTheme } from "./ThemeProvider";

export function MobileFiltersContent() {
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
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Link to="/submit">
          <SheetClose asChild>
            <Button className="w-full justify-start gap-2" variant="default">
              <PlusCircle className="h-4 w-4" />
              Compartilhar Dados
            </Button>
          </SheetClose>
        </Link>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          Alternar tema
        </Button>
      </div>

      {/* Divider island */}
      <div className="h-px bg-foreground/10 my-2" />

      <div className="space-y-2">
        <Label htmlFor="sort-mobile">Ordenar por</Label>
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

      <div className="space-y-2">
        <Label htmlFor="search-mobile">Buscar por empresa ou cargo</Label>
        <Input
          id="search-mobile"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Ex: Google, Desenvolvedor"
          onKeyPress={(e) => e.key === "Enter" && applyFilters()}
        />
      </div>

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

      <TechStackFilter selectedTechnologies={selectedTechnologies} onTechnologiesChange={setSelectedTechnologies} />

      <div className="flex items-center gap-3">
        <Button onClick={clearFilters} variant="outline" className="flex-1">
          Limpar
        </Button>
        <Button onClick={applyFilters} className="flex-1">
          <Search className="h-4 w-4 mr-2" />
          Aplicar
        </Button>
      </div>
    </div>
  );
}
