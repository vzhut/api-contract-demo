import { describe, expect, it } from 'vitest';
import { checkBudget } from '../src/budget.js';

describe('checkBudget', () => {
  it('reports the remaining budget', () => {
    expect(checkBudget(2, 10)).toEqual({ ok: true, remainingUsd: 8 });
  });
});
