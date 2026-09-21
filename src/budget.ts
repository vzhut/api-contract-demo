export interface BudgetCheck {
  ok: boolean;
  remainingUsd: number;
}

/**
 * Compare the cost of a run with the workspace budget.
 * `limitUsd` must be non-negative; a run that exceeds it is reported as not ok.
 */
export function checkBudget(costUsd: number, limitUsd: number): BudgetCheck {
  if (limitUsd < 0) throw new RangeError('limitUsd must be >= 0');
  const remainingUsd = limitUsd - costUsd;
  if (remainingUsd < 0) return { ok: false, remainingUsd: 0 };
  return { ok: true, remainingUsd };
}
