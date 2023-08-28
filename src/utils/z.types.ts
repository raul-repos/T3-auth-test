import { z } from "zod";

export const UserModel = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  emailVerified: z.date().optional(),
  username: z.string(),
  password: z.string(),
  role: z.string()
})


export type UserModelType = z.infer<typeof UserModel>
