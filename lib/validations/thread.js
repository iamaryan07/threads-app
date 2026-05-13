import { z } from "zod";

export const ThreadValidation = z.object({
  thread: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(500, { message: "Maximum 500 characters." })
    .trim(),

  // accountId: z.string().min(1, {
  //   message: "Account ID is required.",
  // }),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(500, { message: "Maximum 500 characters." })
    .trim(),
});
