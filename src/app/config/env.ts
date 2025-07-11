import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  MONGO_URI: string;
  NODE_ENV: "development" | "production";
}

const loadEnvVariables = (): EnvConfig => {
  const requiredVariables: string[] = ["PORT", "MONGO_URI", "NODE_ENV"];
  requiredVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require enviroment variable ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    MONGO_URI: process.env.MONGO_URI!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};
export const envVars = loadEnvVariables();
