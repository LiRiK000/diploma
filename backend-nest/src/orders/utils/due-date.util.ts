export const DEFAULT_LOAN_DAYS = 30;

export function calculateDueDate(days = DEFAULT_LOAN_DAYS) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
