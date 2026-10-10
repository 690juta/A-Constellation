export function validateData(memoryData, branchData) {
  const errors = [];
  const memories = memoryData?.memories;
  const branches = branchData?.branches;
  if (!Array.isArray(memories)) errors.push("memories.json must contain a memories array.");
  if (!Array.isArray(branches)) errors.push("branches.json must contain a branches array.");
  if (errors.length) return errors;

  const ids = new Set();
  for (const memory of memories) {
    if (!memory.id || ids.has(memory.id)) errors.push(`Missing or duplicate memory ID: ${memory.id || "(empty)"}`);
    ids.add(memory.id);
    if (!memory.title || typeof memory.text !== "string") errors.push(`Memory ${memory.id} needs a title and text.`);
    if (memory.dateRemembered && !/^\d{4}-\d{2}-\d{2}$/.test(memory.dateRemembered)) errors.push(`Invalid dateRemembered on ${memory.id}.`);
    if (memory.dateNoticed && !/^\d{4}-\d{2}-\d{2}$/.test(memory.dateNoticed)) errors.push(`Invalid dateNoticed on ${memory.id}.`);
  }
  const branchIds = new Set(branches.map(branch => branch.id));
  for (const branch of branches) {
    if (!branch.id || !branch.name || !/^#[0-9a-fA-F]{6}$/.test(branch.color || "")) errors.push(`Invalid branch definition: ${branch.id || "(empty)"}`);
  }
  for (const memory of memories) {
    if (memory.parentId && !ids.has(memory.parentId)) errors.push(`Unknown parent ${memory.parentId} on ${memory.id}.`);
    if (!branchIds.has(memory.branchId)) errors.push(`Unknown branch ${memory.branchId} on ${memory.id}.`);
    if (!Array.isArray(memory.connections)) errors.push(`connections must be an array on ${memory.id}.`);
    else for (const id of memory.connections) if (!ids.has(id)) errors.push(`Unknown connection ${id} on ${memory.id}.`);
  }
  return errors;
}
