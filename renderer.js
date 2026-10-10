const NS = "http://www.w3.org/2000/svg";
const make = (tag, attrs = {}) => {
  const element = document.createElementNS(NS, tag);
  for (const [key,value] of Object.entries(attrs)) element.setAttribute(key, value);
  return element;
};
export function renderMap({ memories, branches, positions, edges, degree, onSelect, recentIds = new Set() }) {
  const connections = document.querySelector("#connections");
  const stars = document.querySelector("#stars");
  connections.replaceChildren(); stars.replaceChildren();
  const byId = new Map(memories.map(m => [m.id,m]));
  const branchById = new Map(branches.map(b => [b.id,b]));
  const viewW = 1000, viewH = 620;
  document.querySelector("#star-map").setAttribute("viewBox", `0 0 ${viewW} ${viewH}`);

  for (const edge of edges) {
    const a = positions.get(edge.source), b = positions.get(edge.target);
    if (!a || !b) continue;
    const source = byId.get(edge.source);
    const branch = branchById.get(source.branchId);
    connections.append(make("path", {
      d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`,
      class: "connection",
      stroke: branch?.color || "#9aaccb",
      "data-source": edge.source,
      "data-target": edge.target
    }));
  }

  memories.forEach((memory,index) => {
    const pos = positions.get(memory.id);
    const branch = branchById.get(memory.branchId);
    const color = branch?.color || "#b6c8e8";
    const group = make("g", {
      class: `star${recentIds.has(memory.id) ? " recent" : ""}${(degree.get(memory.id)||0) >= 3 ? " sparkle" : ""} arrive`,
      transform: `translate(${pos.x} ${pos.y})`,
      tabindex: "0",
      role: "button",
      "aria-label": `Open memory: ${memory.title}`,
      "data-id": memory.id,
      style: `animation-delay:${index*100}ms;color:${color}`
    });
    const hit = make("circle", { class:"star-hit", r: 18 });
    const halo = make("circle", { class:"star-halo", r: (degree.get(memory.id)||0) >= 3 ? 11 : 8, stroke:color });
    const core = make("circle", { class:"star-core", r: (degree.get(memory.id)||0) >= 3 ? 3.8 : 3, fill:color });
    const sparkle = make("path", { class:"star-spark", d:"M 0 -8 L 0 8 M -8 0 L 8 0 M -5.5 -5.5 L 5.5 5.5 M -5.5 5.5 L 5.5 -5.5" });
    group.append(hit,halo,core,sparkle);
    const label = make("text", { class:"star-label", x: 10, y: -9 });
    label.textContent = memory.title.length > 27 ? `${memory.title.slice(0,25)}…` : memory.title;
    group.append(label);
    group.addEventListener("click", event => { event.stopPropagation(); onSelect(memory.id); });
    group.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(memory.id); }
    });
    stars.append(group);
  });
}
