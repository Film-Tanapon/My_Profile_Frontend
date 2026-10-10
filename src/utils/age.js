export function calculateAge(birthDate, now = new Date()) {
  if (!birthDate) return null;
  const match = String(birthDate).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Bangkok', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(now);
  const current = Object.fromEntries(parts.map(part => [part.type, Number(part.value)]));
  let age = current.year - year;
  if (current.month < month || (current.month === month && current.day < day)) age--;
  return age >= 0 ? age : null;
}
