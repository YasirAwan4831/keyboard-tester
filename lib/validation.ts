import { z } from "zod";

// Generous but real upper bounds. The current verified world record for
// typing speed is well under 300 WPM sustained, so anything far beyond that
// is rejected as malformed rather than an aspirational human result.
const MAX_PLAUSIBLE_WPM = 400;

export const resultSubmissionSchema = z.object({
  wpm: z.number().finite().min(0).max(MAX_PLAUSIBLE_WPM),
  rawWpm: z.number().finite().min(0).max(MAX_PLAUSIBLE_WPM),
  accuracy: z.number().finite().min(0).max(100),
  duration: z.union([z.literal(15), z.literal(30), z.literal(60), z.literal(120)]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  correctCharacters: z.number().int().min(0),
  incorrectCharacters: z.number().int().min(0),
  errors: z.number().int().min(0),
  timestamp: z
    .number()
    .int()
    .positive()
    // Reject timestamps more than a minute in the future (clock skew tolerance).
    .refine((value) => value <= Date.now() + 60_000, {
      message: "timestamp cannot be in the future",
    }),
});

export type ValidatedResultSubmission = z.infer<typeof resultSubmissionSchema>;

export function validateResultSubmission(payload: unknown) {
  return resultSubmissionSchema.safeParse(payload);
}
