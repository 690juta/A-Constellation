export function buildGraph(memories) {
  const byId = new Map(memories.map(memory => [memory.id, memory]));
  const edges = new Map();
  const degree = new Map(memories.map(memory => [memory.id, 0]));
  for (const memory of memories) {
    const targets = new Set([...(memory.connections || []), ...(memory.parentId ? [memory.parentId] : [])]);
    for (const targetId of targets) {
      if (!byId.has(targetId) || targetId === memory.id) continue;
      const key = [memory.id, targetId].sort().join("::");
      if (!edges.has(key)) {
        edges.set(key, { source: memory.id, target: targetId });
        degree.set(memory.id, (degree.get(memory.id) || 0) + 1);
        degree.set(targetId, (degree.get(targetId) || 0) + 1);
      }
    }
  }
  return { byId, edges: [...edges.values()], degree };
}
