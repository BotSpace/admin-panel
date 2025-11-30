import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string(),
  NEXT_PUBLIC_API: z
    .string()
    .url("NEXT_PUBLIC_API must be a valid URL")
    .optional(),
  CONSTRUCTOR_URL: z
    .string()
    .url("CONSTRUCTOR_URL must be a valid URL")
    .optional(),
  SALES_URL: z.string().url("SALES_URL must be a valid URL").optional(),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters")
    .optional(),
});

const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
  CONSTRUCTOR_URL: process.env.CONSTRUCTOR_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  SALES_URL: process.env.SALES_URL,
});

export default env;
