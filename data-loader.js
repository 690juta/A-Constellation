export async function loadData() {
  const [memoryResponse, branchResponse] = await Promise.all([
    fetch("./data/memories.json"),
    fetch("./data/branches.json")
  ]);
  if (!memoryResponse.ok || !branchResponse.ok) throw new Error("The memory files could not be loaded.");
  return Promise.all([memoryResponse.json(), branchResponse.json()]);
}
