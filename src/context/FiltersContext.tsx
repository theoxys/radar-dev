import React, { createContext, useContext, useMemo, useState } from "react";
import type { Technology } from "../types/types";
import type { GetSubmissionsParams } from "../hooks/useSubmissionts";

interface FiltersContextValue {
  filters: GetSubmissionsParams;
  setFilters: React.Dispatch<React.SetStateAction<GetSubmissionsParams>>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  salaryRange: [number, number];
  setSalaryRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  selectedTechnologies: Technology[];
  setSelectedTechnologies: React.Dispatch<React.SetStateAction<Technology[]>>;
  applyFilters: () => void;
  clearFilters: () => void;
}

const FiltersContext = createContext<FiltersContextValue | undefined>(undefined);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<GetSubmissionsParams>({
    page: 1,
    perPage: 20,
    searchQuery: "",
    salaryMin: 0,
    salaryMax: 50000,
    technologyIds: [],
    sort: "recent",
  });

  const [searchInput, setSearchInput] = useState("");
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 50000]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<Technology[]>([]);

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: searchInput,
      salaryMin: salaryRange[0],
      salaryMax: salaryRange[1],
      technologyIds: selectedTechnologies.map((t) => t.id),
      page: 1,
    }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setSalaryRange([0, 50000]);
    setSelectedTechnologies([]);
    setFilters({
      page: 1,
      perPage: 20,
      searchQuery: "",
      salaryMin: 0,
      salaryMax: 50000,
      technologyIds: [],
      sort: "recent",
    });
  };

  const value = useMemo<FiltersContextValue>(
    () => ({
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
    }),
    [filters, searchInput, salaryRange, selectedTechnologies]
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFiltersContext(): FiltersContextValue {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFiltersContext deve ser usado dentro de FiltersProvider");
  return ctx;
}
