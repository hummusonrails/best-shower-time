import { createClient } from "@libsql/client/http";

export function createServerClient() {
  const url = process.env.TURSO_DB_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error("Missing Turso env vars");
  }

  return createClient({
    url: url.trim().replace(/^libsql:\/\//, "https://"),
    authToken: authToken.trim(),
  });
}
