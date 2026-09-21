import { z } from 'zod';

/** Public wire contract for review runs. JSON, snake_case. Consumed by the web client and third-party CLIs. */
export const RunStatus = z.enum(['queued', 'running', 'done', 'failed']);

export const RunResponse = z.object({
  id: z.string().uuid(),
  pr_number: z.number().int(),
  status: RunStatus,
  costUsd: z.number(),
  tokens_in: z.number().int(),
  findings_count: z.number().int(),
});
export type RunResponse = z.infer<typeof RunResponse>;

export const CreateRunBody = z.object({
  pr_number: z.number().int().positive(),
});
export type CreateRunBody = z.infer<typeof CreateRunBody>;
