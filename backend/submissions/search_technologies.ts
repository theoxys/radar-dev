import { api } from "encore.dev/api";
import { submissionsDB } from "./db";
import { SearchTechnologiesRequest, SearchTechnologiesResponse } from "./types";

// Searches for technologies by name with autocomplete functionality.
export const searchTechnologies = api<SearchTechnologiesRequest, SearchTechnologiesResponse>(
  { expose: true, method: "GET", path: "/technologies/search" },
  async (req) => {
    const limit = Math.min(req.limit || 20, 50); // Max 50 results

    const rows = await submissionsDB.queryAll<{
      id: string;
      name: string;
      created_at: Date;
    }>`
      SELECT id, name, created_at
      FROM technologies
      WHERE LOWER(name) LIKE ${`%${req.q.toLowerCase()}%`}
      ORDER BY 
        CASE WHEN LOWER(name) = ${req.q.toLowerCase()} THEN 1 ELSE 2 END,
        LENGTH(name),
        name
      LIMIT ${limit}
    `;

    const technologies = rows.map(row => ({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
    }));

    return { technologies };
  }
);
