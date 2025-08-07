import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { TechStackSelect } from "./TechStackSelect";
import backend from "~backend/client";
import type { CreateSubmissionRequest, Technology } from "~backend/submissions/types";

export function SubmissionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    companyName: "",
    companyLink: "",
    position: "",
    salary: 0,
    comments: "",
    benefits: "",
  });

  const [selectedTechnologies, setSelectedTechnologies] = useState<Technology[]>([]);

  const createSubmission = useMutation({
    mutationFn: (data: CreateSubmissionRequest) => {
      return backend.submissions.create(data);
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Seus dados foram compartilhados anonimamente.",
      });
      navigate("/");
    },
    onError: (error) => {
      console.error("Error creating submission:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar os dados. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.companyLink || !formData.position || !formData.salary) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const submissionData: CreateSubmissionRequest = {
      companyName: formData.companyName,
      companyLink: formData.companyLink,
      position: formData.position,
      salary: formData.salary,
      comments: formData.comments || undefined,
      benefits: formData.benefits || undefined,
      technologyIds: selectedTechnologies.map(tech => tech.id),
    };

    createSubmission.mutate(submissionData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-[992px] mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Compartilhar Informações de Trabalho</CardTitle>
          <CardDescription>
            Compartilhe anonimamente informações sobre seu emprego atual para ajudar outros profissionais.
            Seus dados pessoais não serão armazenados.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="Ex: Google, Microsoft, Nubank"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyLink">Link da Empresa *</Label>
              <Input
                id="companyLink"
                type="url"
                value={formData.companyLink}
                onChange={(e) => handleInputChange("companyLink", e.target.value)}
                placeholder="Ex: https://www.empresa.com ou LinkedIn"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Cargo *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="Ex: Desenvolvedor Front-end, Gerente de Produto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salário (USD) *</Label>
              <Input
                id="salary"
                type="number"
                min="0"
                step="0.01"
                value={formData.salary || ""}
                onChange={(e) => handleInputChange("salary", parseFloat(e.target.value) || 0)}
                placeholder="Ex: 8500.00"
                required
              />
            </div>

            <TechStackSelect
              selectedTechnologies={selectedTechnologies}
              onTechnologiesChange={setSelectedTechnologies}
            />

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefícios</Label>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => handleInputChange("benefits", e.target.value)}
                placeholder="Ex: Vale refeição, plano de saúde, home office, etc."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comentários</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => handleInputChange("comments", e.target.value)}
                placeholder="Comentários sobre a empresa, cultura, ambiente de trabalho, etc."
                rows={4}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createSubmission.isPending}
            >
              {createSubmission.isPending ? "Enviando..." : "Compartilhar Anonimamente"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
