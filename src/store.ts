import { randomUUID } from 'node:crypto';
import type { RunResponse } from './schemas.js';

const runs = new Map<string, RunResponse>();

export function createRun(prNumber: number): RunResponse {
  const run: RunResponse = {
    id: randomUUID(),
    pr_number: prNumber,
    status: 'queued',
    cost_usd: 0,
    tokens_in: 0,
    tokens_out: 0,
    findings_count: null,
  };
  runs.set(run.id, run);
  return run;
}

export function getRun(id: string): RunResponse | undefined {
  return runs.get(id);
}
