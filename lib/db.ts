import { createClient } from "@libsql/client/http";

export function createServerClient() {
  const url = process.env.TURSO_DB_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error("Missing Turso env vars");
  }

  // Strip any non-base64/JWT characters that may have been appended by env var piping
  const cleanToken = authToken.replace(/[^A-Za-z0-9._\-]/g, "");

  return createClient({
    url: url.trim().replace(/^libsql:\/\//, "https://"),
    authToken: cleanToken,
  });
}
