import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { CreateRunBody, RunResponse } from './schemas.js';
import { cancelRun, createRun, getRun } from './store.js';

/**
 *   POST /runs      → 201, RunResponse
 *   GET  /runs/:id  → 200 RunResponse | 404 { error }
 *   POST /runs/:id/cancel → 200 RunResponse | 404 { error }
 */
export async function runsRoutes(appBase: FastifyInstance) {
  const app = appBase.withTypeProvider<ZodTypeProvider>();

  app.post(
    '/runs',
    { schema: { body: CreateRunBody, response: { 201: RunResponse } } },
    async (req, reply) => {
      reply.status(201);
      return createRun(req.body.pr_number);
    },
  );

  app.get(
    '/runs/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: RunResponse, 404: z.object({ error: z.string() }) },
      },
    },
    async (req, reply) => {
      const run = getRun(req.params.id);
      if (!run) return reply.status(404).send({ error: 'run not found' });
      return run;
    },
  );

  app.post(
    '/runs/:id/cancel',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: RunResponse, 404: z.object({ error: z.string() }) },
      },
    },
    async (req, reply) => {
      const run = cancelRun(req.params.id);
      if (!run) return reply.status(404).send({ error: 'run not found' });
      return run;
    },
  );
}
