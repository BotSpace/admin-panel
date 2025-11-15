import * as z from "zod";

export const profileSchema = z.object({
  first_name: z
    .string()
    .min(1, {
      message: "Ism kiritilishi shart.",
    })
    .max(150, {
      message: "Ism 150 belgidan oshmasligi kerak.",
    }),
  last_name: z
    .string()
    .min(1, {
      message: "Familiya kiritilishi shart.",
    })
    .max(150, {
      message: "Familiya 150 belgidan oshmasligi kerak.",
    }),
  email: z
    .string()
    .email({
      message: "To'g'ri email manzil kiriting.",
    })
    .max(254, {
      message: "Email 254 belgidan oshmasligi kerak.",
    }),
  phone: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    old_password: z.string().min(1, {
      message: "Joriy parol kiritilishi shart.",
    }),
    new_password: z
      .string()
      .min(8, {
        message: "Parol kamida 8 belgidan iborat bo'lishi kerak.",
      })
      .regex(/[A-Z]/, {
        message: "Parol kamida bitta katta harf bo'lishi kerak.",
      })
      .regex(/[a-z]/, {
        message: "Parol kamida bitta kichik harf bo'lishi kerak.",
      })
      .regex(/[0-9]/, {
        message: "Parol kamida bitta raqam bo'lishi kerak.",
      }),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Parollar mos kelmaydi.",
    path: ["confirm_password"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;

export interface UserUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface UserUpdateResponse {
  status: boolean;
  data: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
}
