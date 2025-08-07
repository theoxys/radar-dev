import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X, Search } from "lucide-react";
import backend from "~backend/client";
import type { Technology } from "~backend/submissions/types";

interface TechStackFilterProps {
  selectedTechnologies: Technology[];
  onTechnologiesChange: (technologies: Technology[]) => void;
}

export function TechStackFilter({ selectedTechnologies, onTechnologiesChange }: TechStackFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: searchResults } = useQuery({
    queryKey: ["technologies", "search", searchQuery],
    queryFn: () => backend.submissions.searchTechnologies({ q: searchQuery, limit: 10 }),
    enabled: searchQuery.length > 0,
  });

  const handleTechnologySelect = (technology: Technology) => {
    // Check if already selected
    if (selectedTechnologies.some(t => t.id === technology.id)) {
      return;
    }
    
    onTechnologiesChange([...selectedTechnologies, technology]);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleTechnologyRemove = (technologyId: string) => {
    onTechnologiesChange(selectedTechnologies.filter(t => t.id !== technologyId));
  };

  const filteredSuggestions = searchResults?.technologies.filter(
    tech => !selectedTechnologies.some(selected => selected.id === tech.id)
  ) || [];

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3">
      <Label>Filtrar por Tecnologias</Label>
      
      {/* Selected Technologies */}
      {selectedTechnologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTechnologies.map((tech) => (
            <Badge key={tech.id} variant="secondary" className="flex items-center gap-1">
              {tech.name}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleTechnologyRemove(tech.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Buscar tecnologias para filtrar..."
            className="pl-10"
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && searchQuery && (
          <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
            <CardContent className="p-2">
              {filteredSuggestions.length > 0 ? (
                <div className="space-y-1">
                  {filteredSuggestions.map((tech) => (
                    <Button
                      key={tech.id}
                      type="button"
                      variant="ghost"
                      className="w-full justify-start h-auto p-2"
                      onClick={() => handleTechnologySelect(tech)}
                    >
                      {tech.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 p-2">
                  Nenhuma tecnologia encontrada
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
