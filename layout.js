function hashString(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
export function layoutMemories(memories) {
  const sorted = [...memories].sort((a,b) => (a.order ?? 9999) - (b.order ?? 9999));
  const positions = new Map();
  const roots = sorted.filter(m => !m.parentId || !sorted.some(p => p.id === m.parentId));
  const rootList = roots.length ? roots : sorted.slice(0,1);
  const cx = 500, cy = 310, rx = 285, ry = 185;
  rootList.forEach((root, index) => {
    const angle = -Math.PI/2 + (Math.PI*2*index/rootList.length);
    positions.set(root.id, { x: cx + Math.cos(angle)*rx*.58, y: cy + Math.sin(angle)*ry*.58 });
  });

  // Place parented memories outward from their parent using stable ID-based angles.
  const pending = sorted.filter(m => !positions.has(m.id));
  let guard = 0;
  while (pending.length && guard++ < sorted.length * 3) {
    let progress = false;
    for (let i = pending.length - 1; i >= 0; i--) {
      const memory = pending[i];
      const parent = positions.get(memory.parentId);
      if (!parent) continue;
      const angle = (hashString(memory.id) % 6283) / 1000;
      positions.set(memory.id, { x: parent.x + Math.cos(angle)*95, y: parent.y + Math.sin(angle)*78 });
      pending.splice(i,1); progress = true;
    }
    if (!progress) break;
  }

  // Isolated roots or unresolved/cyclic nodes receive deterministic positions.
  pending.forEach((memory, index) => {
    const angle = (hashString(memory.id) % 6283) / 1000;
    const ring = 1 + Math.floor(index / 8);
    positions.set(memory.id, { x: cx + Math.cos(angle)*105*ring, y: cy + Math.sin(angle)*75*ring });
  });

  // Spread independent seed memories around a readable orbital field.
  if (rootList.length === sorted.length) {
    sorted.forEach((memory, index) => {
      const angle = -Math.PI/2 + index * (Math.PI*2/sorted.length);
      const jitter = ((hashString(memory.id) % 19) - 9) * 1.2;
      positions.set(memory.id, {
        x: cx + Math.cos(angle)*(205 + jitter),
        y: cy + Math.sin(angle)*(128 + jitter)
      });
    });
  }
  return positions;
}
