export interface AppConfig {
  port: number;
  frontendOrigin: string;
  databaseUrl: string | undefined;
  jwtSecret: string;
  jwtExpiresIn: string;
}

const DEFAULT_PORT = 3001;
const DEFAULT_FRONTEND_ORIGIN = "http://localhost:3000";
const DEFAULT_JWT_EXPIRES_IN = "7d";

export function configuration(): AppConfig {
  const parsedPort = Number(process.env.PORT);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is required");
  }

  return {
    port: Number.isNaN(parsedPort) ? DEFAULT_PORT : parsedPort,
    frontendOrigin: process.env.FRONTEND_ORIGIN ?? DEFAULT_FRONTEND_ORIGIN,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? DEFAULT_JWT_EXPIRES_IN,
  };
}
