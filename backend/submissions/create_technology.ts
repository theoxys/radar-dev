import { api, APIError } from "encore.dev/api";
import { submissionsDB } from "./db";
import { CreateTechnologyRequest, Technology } from "./types";

// Creates a new technology if it doesn't already exist.
export const createTechnology = api<CreateTechnologyRequest, Technology>(
  { expose: true, method: "POST", path: "/technologies" },
  async (req) => {
    // Check if technology already exists
    const existing = await submissionsDB.queryRow<{
      id: string;
      name: string;
      created_at: Date;
    }>`
      SELECT id, name, created_at
      FROM technologies
      WHERE LOWER(name) = ${req.name.toLowerCase()}
    `;

    if (existing) {
      throw APIError.alreadyExists("Technology already exists");
    }

    // Create new technology
    const row = await submissionsDB.queryRow<{
      id: string;
      name: string;
      created_at: Date;
    }>`
      INSERT INTO technologies (name)
      VALUES (${req.name.trim()})
      RETURNING id, name, created_at
    `;

    if (!row) {
      throw new Error("Failed to create technology");
    }

    return {
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
    };
  }
);
