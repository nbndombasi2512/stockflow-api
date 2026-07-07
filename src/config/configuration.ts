export interface AppConfig {
  port: number;
  frontendOrigin: string;
  databaseUrl: string | undefined;
}

const DEFAULT_PORT = 3001;
const DEFAULT_FRONTEND_ORIGIN = "http://localhost:3000";

export function configuration(): AppConfig {
  const parsedPort = Number(process.env.PORT);

  return {
    port: Number.isNaN(parsedPort) ? DEFAULT_PORT : parsedPort,
    frontendOrigin: process.env.FRONTEND_ORIGIN ?? DEFAULT_FRONTEND_ORIGIN,
    databaseUrl: process.env.DATABASE_URL,
  };
}
