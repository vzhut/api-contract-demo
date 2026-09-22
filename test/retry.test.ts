import { describe, expect, it, vi } from 'vitest';
import { withRetry } from '../src/retry.js';

describe('withRetry', () => {
  it('returns the value on the first successful attempt, without sleeping', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await withRetry(fn, { retries: 3, baseDelayMs: 10 }, sleep);
    expect(result).toEqual({ value: 'ok', attempts: 1 });
    expect(sleep).not.toHaveBeenCalled();
  });

  it('retries after failures, waiting a growing delay each time, then succeeds', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValue('ok');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await withRetry(fn, { retries: 3, baseDelayMs: 10 }, sleep);
    expect(result).toEqual({ value: 'ok', attempts: 3 });
    expect(sleep).toHaveBeenNthCalledWith(1, 10);
    expect(sleep).toHaveBeenNthCalledWith(2, 20);
  });

  it('tries exactly once when retries is 0, and never sleeps', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('boom'));
    const sleep = vi.fn();
    await expect(withRetry(fn, { retries: 0, baseDelayMs: 10 }, sleep)).rejects.toThrow('boom');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('rethrows the last error once every retry is exhausted', async () => {
    const err = new Error('always fails');
    const fn = vi.fn().mockRejectedValue(err);
    const sleep = vi.fn().mockResolvedValue(undefined);
    await expect(withRetry(fn, { retries: 2, baseDelayMs: 5 }, sleep)).rejects.toBe(err);
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
