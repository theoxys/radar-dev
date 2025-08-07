import { api } from "encore.dev/api";
import { submissionsDB } from "./db";
import { ListSubmissionsRequest, ListSubmissionsResponse } from "./types";

// Retrieves all job submissions with optional filtering and pagination.
export const list = api<ListSubmissionsRequest, ListSubmissionsResponse>(
  { expose: true, method: "GET", path: "/submissions" },
  async (req) => {
    const page = req.page || 1;
    const perPage = Math.min(req.perPage || 20, 100); // Max 100 per page
    const offset = (page - 1) * perPage;

    // Build WHERE conditions
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (req.salaryMin !== undefined) {
      conditions.push(`s.salary >= $${paramIndex}`);
      params.push(req.salaryMin);
      paramIndex++;
    }

    if (req.salaryMax !== undefined) {
      conditions.push(`s.salary <= $${paramIndex}`);
      params.push(req.salaryMax);
      paramIndex++;
    }

    if (req.q) {
      conditions.push(`(LOWER(s.company_name) LIKE $${paramIndex} OR LOWER(s.position) LIKE $${paramIndex})`);
      params.push(`%${req.q.toLowerCase()}%`);
      paramIndex++;
    }

    if (req.technologyIds && req.technologyIds.length > 0) {
      const placeholders = req.technologyIds.map(() => `$${paramIndex++}`).join(',');
      conditions.push(`s.id IN (
        SELECT DISTINCT st.submission_id 
        FROM submission_technologies st 
        WHERE st.technology_id IN (${placeholders})
      )`);
      params.push(...req.technologyIds);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(DISTINCT s.id) as count FROM submissions s ${whereClause}`;
    const countResult = await submissionsDB.rawQueryRow<{ count: string }>(countQuery, ...params);
    const total = parseInt(countResult?.count || '0');

    // Get submissions
    const dataQuery = `
      SELECT DISTINCT s.id, s.company_name, s.company_link, s.position, s.salary, s.comments, s.benefits, s.created_at
      FROM submissions s
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(perPage, offset);

    const rows = await submissionsDB.rawQueryAll<{
      id: string;
      company_name: string;
      company_link: string;
      position: string;
      salary: number;
      comments: string | null;
      benefits: string | null;
      created_at: Date;
    }>(dataQuery, ...params);

    // Get technologies for each submission
    const submissionIds = rows.map(row => row.id);
    const technologiesMap = new Map<string, any[]>();

    if (submissionIds.length > 0) {
      const technologiesQuery = `
        SELECT st.submission_id, t.id, t.name, t.created_at
        FROM submission_technologies st
        JOIN technologies t ON st.technology_id = t.id
        WHERE st.submission_id = ANY($1)
        ORDER BY t.name
      `;
      
      const techRows = await submissionsDB.rawQueryAll<{
        submission_id: string;
        id: string;
        name: string;
        created_at: Date;
      }>(technologiesQuery, submissionIds);

      for (const techRow of techRows) {
        if (!technologiesMap.has(techRow.submission_id)) {
          technologiesMap.set(techRow.submission_id, []);
        }
        technologiesMap.get(techRow.submission_id)!.push({
          id: techRow.id,
          name: techRow.name,
          createdAt: techRow.created_at,
        });
      }
    }

    const submissions = rows.map(row => ({
      id: row.id,
      companyName: row.company_name,
      companyLink: row.company_link,
      position: row.position,
      salary: row.salary,
      comments: row.comments || undefined,
      benefits: row.benefits || undefined,
      technologies: technologiesMap.get(row.id) || [],
      createdAt: row.created_at,
    }));

    const totalPages = Math.ceil(total / perPage);

    return {
      submissions,
      total,
      page,
      perPage,
      totalPages,
    };
  }
);
