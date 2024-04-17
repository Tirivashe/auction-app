import { z } from "zod";
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
export const schema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  description: z.string().min(1, "Name cannot be empty"),
  price: z.number().min(1, { message: "Cannot be less than 1" }),
  image: z
    .any()
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPEG and PNG formats are supported"
    ),
  expiresAt: z.date(),
  isActive: z.boolean().optional(),
});
