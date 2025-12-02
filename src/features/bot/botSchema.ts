// schemas/botSchema.ts

import * as z from "zod";

export const botFormSchema = z.object({
  name: z.string().min(2, {
    message: "Bot nomi kamida 2 ta belgidan iborat bo'lishi kerak.",
  }),
  token: z.union([
    z.string().min(10, {
      message: "Bot tokeni to'liq kiritilishi kerak.",
    }),
    z.literal(""),
  ]),
  plan_id: z.number({
    required_error: "Tarif rejasini tanlang.",
    invalid_type_error: "Tarif rejasini tanlang.",
  }),
});
