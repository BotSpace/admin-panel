// schemas/botSchema.ts

import * as z from "zod";

export const botFormSchema = z.object({
  name: z.string().min(2, {
    message: "Bot nomi kamida 2 ta belgidan iborat bo'lishi kerak.",
  }),
});
