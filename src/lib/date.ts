function pad2(value: number) {
  return value.toString().padStart(2, "0");
}

export function getLocalDateString(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function parseLocalDateString(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function shiftLocalDate(date: Date, days: number) {
  const shifted = new Date(date);
  shifted.setHours(12, 0, 0, 0);
  shifted.setDate(shifted.getDate() + days);
  return shifted;
}

export function getRelativeLocalDateString(days: number, baseDate = new Date()) {
  return getLocalDateString(shiftLocalDate(baseDate, days));
}

