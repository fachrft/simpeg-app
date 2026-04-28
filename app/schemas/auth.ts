import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Format email salah").min(3, "Email minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginInput = z.output<typeof LoginSchema>;
