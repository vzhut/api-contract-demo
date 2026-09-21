import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';

describe('runs API', () => {
  it('creates a run and reads it back', async () => {
    const app = buildApp();
    const created = await app.inject({ method: 'POST', url: '/runs', payload: { pr_number: 7 } });
    expect(created.statusCode).toBe(201);
    const { id } = created.json();

    const fetched = await app.inject({ method: 'GET', url: `/runs/${id}` });
    expect(fetched.statusCode).toBe(200);
    expect(fetched.json()).toMatchObject({ id, pr_number: 7, status: 'queued', cost_usd: 0, findings_count: null });
  });

  it('returns 404 for an unknown run', async () => {
    const app = buildApp();
    const res = await app.inject({ method: 'GET', url: '/runs/00000000-0000-4000-8000-000000000000' });
    expect(res.statusCode).toBe(404);
  });
});
