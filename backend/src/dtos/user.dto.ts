import { z } from 'zod';

const passwordSchema = z.string().superRefine((val, ctx) => {
  const requirements = [
    { regex: /.{8,}/, message: 'Password must be at least 8 characters long' },
    { regex: /[A-Z]/, message: 'Must contain at least one uppercase letter' },
    { regex: /[a-z]/, message: 'Must contain at least one lowercase letter' },
    { regex: /[0-9]/, message: 'Must contain at least one number' },
    { regex: /[^A-Za-z0-9]/, message: 'Must contain at least one special character' },
    { regex: /^\S*$/, message: 'Password cannot contain whitespace' },
  ];

  requirements.forEach((req) => {
    if (!req.regex.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: req.message,
      });
    }
  });
});

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: passwordSchema,
  createdAt: z.date().optional(),
  profileBio: z.string().optional(),
  profileImage: z.string().url('Invalid URL format').optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: passwordSchema,
  createdAt: z.date().optional(),
  profileBio: z.string().optional(),
  profileImage: z.string().url('Invalid URL format').optional(),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
