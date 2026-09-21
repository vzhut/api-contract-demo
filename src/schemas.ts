import { z } from 'zod';

/** Public wire contract for review runs. JSON, snake_case. Consumed by the web client and third-party CLIs. */
export const RunStatus = z.enum(['queued', 'running', 'done', 'failed', 'cancelled']);

export const RunResponse = z.object({
  id: z.string().uuid(),
  pr_number: z.number().int(),
  status: RunStatus,
  cost_usd: z.number(),
  tokens_in: z.number().int(),
  tokens_out: z.number().int(),
  findings_count: z.number().int(),
});
export type RunResponse = z.infer<typeof RunResponse>;

export const CreateRunBody = z.object({
  pr_number: z.number().int().positive(),
});
export type CreateRunBody = z.infer<typeof CreateRunBody>;
