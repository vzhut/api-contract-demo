export interface RetryOptions {
  /** Number of retries AFTER the first attempt. 0 means "try once, no retry". */
  retries: number;
  /** Base delay in ms; actual delay grows linearly with the attempt number. */
  baseDelayMs: number;
}

export interface RetryResult<T> {
  value: T;
  attempts: number;
}

/**
 * Run `fn`, retrying on rejection up to `opts.retries` more times with a linear
 * backoff. Rethrows the last error once retries are exhausted.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions,
  sleep: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms)),
): Promise<RetryResult<T>> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= opts.retries + 1; attempt++) {
    try {
      const value = await fn();
      return { value, attempts: attempt };
    } catch (err) {
      lastErr = err;
      if (attempt <= opts.retries) {
        await sleep(opts.baseDelayMs * attempt);
      }
    }
  }
  throw lastErr;
}
