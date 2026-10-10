const byId = list => new Map(list.map(item => [item.id,item]));
function formatDate(dateString) {
  if (!dateString) return "A date not yet written";
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "A date not yet written";
  return new Intl.DateTimeFormat("en", { day:"numeric", month:"long", year:"numeric" }).format(date);
}
export function createMemoryCard({ memories, branches, onNavigate, onClose }) {
  const memoryMap = byId(memories);
  const branchMap = byId(branches);
  const card = document.querySelector("#memory-card");
  const backdrop = document.querySelector("#card-backdrop");
  const closeButton = document.querySelector("#close-card");
  const title = document.querySelector("#card-title");
  const text = document.querySelector("#card-text");
  const date = document.querySelector("#card-date");
  const branchName = document.querySelector("#card-branch");
  const branchDot = document.querySelector("#card-branch-dot");
  const connectedList = document.querySelector("#connected-list");
  const connectedCount = document.querySelector("#connected-count");
  const footnote = document.querySelector("#card-footnote");

  function close() { card.hidden = true; backdrop.hidden = true; onClose?.(); }
  closeButton.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !card.hidden) close(); });

  function open(id) {
    const memory = memoryMap.get(id);
    if (!memory) return;
    const branch = branchMap.get(memory.branchId);
    title.textContent = memory.title;
    text.textContent = memory.text;
    branchName.textContent = branch?.name || "A MEMORY";
    branchDot.style.background = branch?.color || "#b6c8e8";
    date.textContent = memory.dateNoticed
      ? `Noticed ${formatDate(memory.dateNoticed)}${memory.dateRemembered ? ` · First remembered ${formatDate(memory.dateRemembered)}` : ""}`
      : memory.dateRemembered ? `First remembered ${formatDate(memory.dateRemembered)} · Notice date not yet written` : "A remembered thing · Dates not yet written";
    connectedList.replaceChildren();
    const ids = new Set([...(memory.connections || []), ...(memory.parentId ? [memory.parentId] : []), ...memories.filter(m => m.parentId === id).map(m => m.id)]);
    ids.delete(id);
    const related = [...ids].map(memoryMap.get.bind(memoryMap)).filter(Boolean);
    connectedCount.textContent = String(related.length).padStart(2,"0");
    if (!related.length) {
      const empty = document.createElement("p");
      empty.className = "empty-connections";
      empty.textContent = "This star is standing on its own for now. Connections can be added as the sky grows.";
      connectedList.append(empty);
    } else {
      for (const item of related) {
        const itemBranch = branchMap.get(item.branchId);
        const button = document.createElement("button");
        button.type = "button"; button.className = "connected-button";
        const dot = document.createElement("span"); dot.className = "connected-dot"; dot.style.background = itemBranch?.color || "#b6c8e8";
        const label = document.createElement("span"); label.textContent = item.title;
        button.append(dot,label);
        button.addEventListener("click", () => { onNavigate(item.id); open(item.id); });
        connectedList.append(button);
      }
    }
    footnote.textContent = "Some things stay, even when the moment has passed.";
    card.hidden = false; backdrop.hidden = false;
    closeButton.focus();
  }
  return { open, close };
}
