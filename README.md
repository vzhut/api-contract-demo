# api-contract-demo

A tiny Fastify + Zod service used as the **review target** for DevDigest's control experiments
(API Contract Reviewer and Test Quality Reviewer, with and without skills).

`main` is the clean baseline. Each experiment lives in an open pull request that is never merged.
The wire contract is JSON with `snake_case` fields; see `src/schemas.ts`.
