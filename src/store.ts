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
    findings_count: 0,
  };
  runs.set(run.id, run);
  return run;
}

export function getRun(id: string): RunResponse | undefined {
  return runs.get(id);
}

export function cancelRun(id: string): RunResponse | undefined {
  const run = runs.get(id);
  if (!run) return undefined;
  if (run.status === 'done' || run.status === 'failed' || run.status === 'cancelled') return run;
  const cancelled: RunResponse = { ...run, status: 'cancelled' };
  runs.set(id, cancelled);
  return cancelled;
}
