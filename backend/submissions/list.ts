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
      conditions.push(`salary >= $${paramIndex}`);
      params.push(req.salaryMin);
      paramIndex++;
    }

    if (req.salaryMax !== undefined) {
      conditions.push(`salary <= $${paramIndex}`);
      params.push(req.salaryMax);
      paramIndex++;
    }

    if (req.q) {
      conditions.push(`(LOWER(company_name) LIKE $${paramIndex} OR LOWER(position) LIKE $${paramIndex})`);
      params.push(`%${req.q.toLowerCase()}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM submissions ${whereClause}`;
    const countResult = await submissionsDB.rawQueryRow<{ count: string }>(countQuery, ...params);
    const total = parseInt(countResult?.count || '0');

    // Get submissions
    const dataQuery = `
      SELECT id, company_name, company_link, position, salary, comments, benefits, created_at
      FROM submissions
      ${whereClause}
      ORDER BY created_at DESC
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

    const submissions = rows.map(row => ({
      id: row.id,
      companyName: row.company_name,
      companyLink: row.company_link,
      position: row.position,
      salary: row.salary,
      comments: row.comments || undefined,
      benefits: row.benefits || undefined,
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
