import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ChevronDown, ChevronUp, Calendar, DollarSign } from "lucide-react";
import type { Submission } from "~backend/submissions/types";

interface SubmissionCardProps {
  submission: Submission;
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(salary);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {submission.companyName}
              <a
                href={submission.companyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardTitle>
            <p className="text-gray-600">{submission.position}</p>
          </div>
          
          <div className="text-right">
            <Badge variant="secondary" className="text-lg font-semibold">
              <DollarSign className="h-4 w-4 mr-1" />
              {formatSalary(submission.salary)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            {formatDate(submission.createdAt)}
          </div>

          {(submission.comments || submission.benefits) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1"
            >
              {showDetails ? "Ocultar" : "Ver"} Detalhes
              {showDetails ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {showDetails && (submission.comments || submission.benefits) && (
          <div className="mt-4 pt-4 border-t space-y-3">
            {submission.benefits && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">Benefícios:</h4>
                <p className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                  {submission.benefits}
                </p>
              </div>
            )}
            
            {submission.comments && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">Comentários:</h4>
                <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                  {submission.comments}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
