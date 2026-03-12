import { differenceInCalendarDays, parseISO } from "date-fns";

export function getDaysLeft(endDate: string): number {
  return differenceInCalendarDays(parseISO(endDate), new Date());
}

export function isUrgent(daysLeft: number): boolean {
  return daysLeft <= 3;
}

export function getDaysLeftLabel(daysLeft: number): string {
  if (daysLeft < 0) return "Overdue";
  if (daysLeft === 0) return "0 days left";
  if (daysLeft === 1) return "1 day left";
  return `${daysLeft} days left`;
}
