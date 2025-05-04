import { z } from 'zod';

export const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: 'dir mot de passe yesslah' })
});

export const signUpFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
});
