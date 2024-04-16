import { z } from "zod";
export const schema = z.object({
  username: z.string().min(1, "Username cannot be empty"),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" }),
  admin: z.boolean().optional(),
});
