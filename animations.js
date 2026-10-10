export function getRecentIds(memories, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(today);
  start.setDate(start.getDate() - 6);
  const ids = new Set();
  for (const memory of memories) {
    if (!memory.dateNoticed) continue;
    const date = new Date(`${memory.dateNoticed}T12:00:00`);
    if (Number.isNaN(date.getTime())) continue;
    if (date >= start && date < new Date(today.getTime() + 86400000)) ids.add(memory.id);
  }
  return ids;
}
