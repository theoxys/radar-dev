import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { submissionsDB } from "./db";
import { CreateSubmissionRequest, Submission } from "./types";

// Creates a new anonymous job submission.
export const create = api<CreateSubmissionRequest, Submission>(
  { expose: true, method: "POST", path: "/submissions", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    // Start a transaction
    const tx = await submissionsDB.begin();
    
    try {
      // Insert the submission
      const submissionRow = await tx.queryRow<{
        id: string;
        company_name: string;
        company_link: string;
        position: string;
        salary: number;
        comments: string | null;
        benefits: string | null;
        created_at: Date;
      }>`
        INSERT INTO submissions (company_name, company_link, position, salary, comments, benefits, user_id)
        VALUES (${req.companyName}, ${req.companyLink}, ${req.position}, ${req.salary}, ${req.comments || null}, ${req.benefits || null}, ${auth.userID})
        RETURNING id, company_name, company_link, position, salary, comments, benefits, created_at
      `;

      if (!submissionRow) {
        throw new Error("Failed to create submission");
      }

      // Insert technology associations
      for (const technologyId of req.technologyIds) {
        await tx.exec`
          INSERT INTO submission_technologies (submission_id, technology_id)
          VALUES (${submissionRow.id}, ${technologyId})
        `;
      }

      // Get the technologies for the response
      const technologies = await tx.queryAll<{
        id: string;
        name: string;
        created_at: Date;
      }>`
        SELECT t.id, t.name, t.created_at
        FROM technologies t
        JOIN submission_technologies st ON t.id = st.technology_id
        WHERE st.submission_id = ${submissionRow.id}
        ORDER BY t.name
      `;

      await tx.commit();

      return {
        id: submissionRow.id,
        companyName: submissionRow.company_name,
        companyLink: submissionRow.company_link,
        position: submissionRow.position,
        salary: submissionRow.salary,
        comments: submissionRow.comments || undefined,
        benefits: submissionRow.benefits || undefined,
        technologies: technologies.map(tech => ({
          id: tech.id,
          name: tech.name,
          createdAt: tech.created_at,
        })),
        createdAt: submissionRow.created_at,
      };
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
);
