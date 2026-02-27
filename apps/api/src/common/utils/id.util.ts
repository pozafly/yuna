export function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function plusMinutes(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function plusDays(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
