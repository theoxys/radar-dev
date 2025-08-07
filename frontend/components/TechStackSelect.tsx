import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { X, Plus, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import backend from "~backend/client";
import type { Technology } from "~backend/submissions/types";

interface TechStackSelectProps {
  selectedTechnologies: Technology[];
  onTechnologiesChange: (technologies: Technology[]) => void;
}

export function TechStackSelect({ selectedTechnologies, onTechnologiesChange }: TechStackSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["technologies", "search", searchQuery],
    queryFn: () => backend.submissions.searchTechnologies({ q: searchQuery, limit: 20 }),
    enabled: searchQuery.length > 0,
  });

  const createTechnologyMutation = useMutation({
    mutationFn: (name: string) => backend.submissions.createTechnology({ name }),
    onSuccess: (newTechnology) => {
      // Add the new technology to selected list
      onTechnologiesChange([...selectedTechnologies, newTechnology]);
      setSearchQuery("");
      setOpen(false);
      
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
    setOpen(false);
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

  const showCreateOption = searchQuery.trim() && !exactMatch && !isSearching;

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

      {/* Combobox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Selecionar tecnologias...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Digite uma tecnologia (ex: React, Node.js, Python)"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isSearching && searchQuery && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm text-gray-500">Buscando...</span>
                </div>
              )}
              
              {!isSearching && (
                <CommandEmpty>
                  {searchQuery ? "Nenhuma tecnologia encontrada" : "Digite para buscar tecnologias"}
                </CommandEmpty>
              )}
              
              {!isSearching && filteredSuggestions.length > 0 && (
                <CommandGroup heading="Tecnologias disponíveis">
                  {filteredSuggestions.map((tech) => (
                    <CommandItem
                      key={tech.id}
                      value={tech.name}
                      onSelect={() => handleTechnologySelect(tech)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTechnologies.some(t => t.id === tech.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {tech.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {showCreateOption && (
                <CommandGroup heading="Criar nova tecnologia">
                  <CommandItem
                    value={`create-${searchQuery}`}
                    onSelect={handleCreateTechnology}
                    disabled={createTechnologyMutation.isPending}
                    className="cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {createTechnologyMutation.isPending 
                      ? "Criando..." 
                      : `Cadastrar "${searchQuery.trim()}"`
                    }
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
