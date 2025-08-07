import { api } from "encore.dev/api";
import { submissionsDB } from "./db";
import { CreateSubmissionRequest, Submission } from "./types";

// Creates a new anonymous job submission.
export const create = api<CreateSubmissionRequest, Submission>(
  { expose: true, method: "POST", path: "/submissions" },
  async (req) => {
    const row = await submissionsDB.queryRow<{
      id: string;
      company_name: string;
      company_link: string;
      position: string;
      salary: number;
      comments: string | null;
      benefits: string | null;
      created_at: Date;
    }>`
      INSERT INTO submissions (company_name, company_link, position, salary, comments, benefits)
      VALUES (${req.companyName}, ${req.companyLink}, ${req.position}, ${req.salary}, ${req.comments || null}, ${req.benefits || null})
      RETURNING id, company_name, company_link, position, salary, comments, benefits, created_at
    `;

    if (!row) {
      throw new Error("Failed to create submission");
    }

    return {
      id: row.id,
      companyName: row.company_name,
      companyLink: row.company_link,
      position: row.position,
      salary: row.salary,
      comments: row.comments || undefined,
      benefits: row.benefits || undefined,
      createdAt: row.created_at,
    };
  }
);
