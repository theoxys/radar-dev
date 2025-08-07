import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { Technology } from "~backend/submissions/types";

interface TechStackSelectProps {
  selectedTechnologies: Technology[];
  onTechnologiesChange: (technologies: Technology[]) => void;
}

export function TechStackSelect({ selectedTechnologies, onTechnologiesChange }: TechStackSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: searchResults } = useQuery({
    queryKey: ["technologies", "search", searchQuery],
    queryFn: () => backend.submissions.searchTechnologies({ q: searchQuery, limit: 10 }),
    enabled: searchQuery.length > 0,
  });

  const createTechnologyMutation = useMutation({
    mutationFn: (name: string) => backend.submissions.createTechnology({ name }),
    onSuccess: (newTechnology) => {
      // Add the new technology to selected list
      onTechnologiesChange([...selectedTechnologies, newTechnology]);
      setSearchQuery("");
      setShowSuggestions(false);
      
      // Invalidate search cache
      queryClient.invalidateQueries({ queryKey: ["technologies", "search"] });
      
      toast({
        title: "Tecnologia criada!",
        description: `"${newTechnology.name}" foi adicionada com sucesso!`,
      });
    },
    onError: (error: any) => {
      console.error("Error creating technology:", error);
      if (error.message?.includes("already exists")) {
        toast({
          title: "Tecnologia já existe",
          description: "Esta tecnologia já está cadastrada no sistema.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível criar a tecnologia. Tente novamente.",
          variant: "destructive",
        });
      }
    },
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

  const handleCreateTechnology = () => {
    const trimmedName = searchQuery.trim();
    if (trimmedName) {
      createTechnologyMutation.mutate(trimmedName);
    }
  };

  const filteredSuggestions = searchResults?.technologies.filter(
    tech => !selectedTechnologies.some(selected => selected.id === tech.id)
  ) || [];

  const exactMatch = filteredSuggestions.find(
    tech => tech.name.toLowerCase() === searchQuery.toLowerCase()
  );

  const showCreateOption = searchQuery.trim() && !exactMatch && filteredSuggestions.length === 0;

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3">
      <Label>Stack Tecnológica</Label>
      
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
            placeholder="Digite uma tecnologia (ex: React, Node.js, Python)"
            className="pl-10"
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && searchQuery && (
          <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
            <CardContent className="p-2">
              {filteredSuggestions.length > 0 && (
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
              )}

              {showCreateOption && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start h-auto p-2 border-dashed"
                  onClick={handleCreateTechnology}
                  disabled={createTechnologyMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {createTechnologyMutation.isPending 
                    ? "Criando..." 
                    : `Cadastrar "${searchQuery.trim()}"`
                  }
                </Button>
              )}

              {searchQuery && filteredSuggestions.length === 0 && !showCreateOption && (
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
