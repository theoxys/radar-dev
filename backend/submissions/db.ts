import { SQLDatabase } from "encore.dev/storage/sqldb";

export const submissionsDB = new SQLDatabase("submissions", {
  migrations: "./migrations",
});
