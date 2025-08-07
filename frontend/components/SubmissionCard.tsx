import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Code } from "lucide-react";
import type { Submission } from "~backend/submissions/types";

interface SubmissionCardProps {
  submission: Submission;
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(salary);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const hasDetails = submission.comments || submission.benefits;

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => hasDetails && setShowDetails(!showDetails)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {submission.companyName}
              <a
                href={submission.companyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardTitle>
            <p className="text-muted-foreground">{submission.position}</p>
          </div>

          <div className="text-right">
            <Badge variant="secondary" className="text-lg font-semibold">
              {formatSalary(submission.salary)}
            </Badge>
          </div>
        </div>

        {/* Tech Stack */}
        {submission.technologies.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Code className="h-4 w-4" />
              <span>Stack:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {submission.technologies.map((tech) => (
                <Badge key={tech.id} variant="outline" className="text-xs">
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(submission.createdAt)}
          </div>

          {hasDetails && (
            <div className="text-sm text-muted-foreground">
              {showDetails ? "Clique para ocultar detalhes" : "Clique para ver detalhes"}
            </div>
          )}
        </div>

        <AnimatePresence>
          {showDetails && hasDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t space-y-3">
                {submission.benefits && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h4 className="font-medium text-sm text-foreground mb-1">Benefícios:</h4>
                    <p className="text-sm text-green-900 dark:text-green-100 bg-green-200/50 dark:bg-green-500/10 p-2 rounded">
                      {submission.benefits}
                    </p>
                  </motion.div>
                )}

                {submission.comments && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-medium text-sm text-foreground mb-1">Comentários:</h4>
                    <p className="text-sm text-blue-900 dark:text-blue-100  bg-blue-100/50 dark:bg-blue-500/10 p-2 rounded">
                      {submission.comments}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
