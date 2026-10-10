import { loadData } from "./data-loader.js";
import { validateData } from "./validate-data.js";
import { buildGraph } from "./graph.js";
import { layoutMemories } from "./layout.js";
import { renderMap } from "./renderer.js";
import { createMemoryCard } from "./memory-card.js";
import { attachPanZoom } from "./interactions.js";
import { getRecentIds } from "./animations.js";

const loading = document.querySelector("#loading-state");
const toast = document.querySelector("#toast");
function showError(message) {
  loading.hidden = false;
  loading.textContent = message;
  loading.style.padding = "24px";
  loading.style.textAlign = "center";
  toast.hidden = true;
}
try {
  const [memoryData, branchData] = await loadData();
  const errors = validateData(memoryData, branchData);
  if (errors.length) throw new Error(`The memory archive needs attention: ${errors.slice(0,3).join(" ")}`);
  const memories = memoryData.memories;
  const branches = branchData.branches;
  const graph = buildGraph(memories);
  const positions = layoutMemories(memories);
  const sky = document.querySelector("#sky");
  const svg = document.querySelector("#star-map");
  const world = document.querySelector("#world");
  const card = createMemoryCard({
    memories, branches,
    onNavigate: id => panZoom.centerOn(id, positions),
    onClose: () => {}
  });
  renderMap({
    memories, branches, positions, edges:graph.edges, degree:graph.degree,
    recentIds:getRecentIds(memories),
    onSelect:id => card.open(id)
  });
  const panZoom = attachPanZoom({ sky, svg, world });
  loading.hidden = true;
  document.querySelector("#memory-count").textContent = `${String(memories.length).padStart(2,"0")} remembered things`;
  document.querySelector("#sky-hint").textContent = memories.length
    ? "Six small things, a sky just beginning."
    : "The sky is waiting for its first star.";
  if (!memories.some(m => m.dateNoticed)) document.querySelector("#recent-legend").style.opacity = ".45";
} catch (error) {
  console.error(error);
  showError("The sky couldn't be opened. Please check the memory data and try again.");
}
