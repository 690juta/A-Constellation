export function attachPanZoom({ sky, svg, world, onReset }) {
  let tx = 0, ty = 0, scale = 1;
  let start = null;
  let pointerMoved = false;
  const minScale = .7, maxScale = 1.8;
  function apply() { world.setAttribute("transform", `translate(${tx} ${ty}) scale(${scale})`); }
  function reset() { tx = 0; ty = 0; scale = 1; apply(); onReset?.(); }
  sky.addEventListener("pointerdown", event => {
    if (event.target.closest?.(".star")) return;
    start = { x:event.clientX, y:event.clientY, tx, ty, pointerId:event.pointerId };
    pointerMoved = false;
    sky.setPointerCapture?.(event.pointerId);
  });
  sky.addEventListener("pointermove", event => {
    if (!start || start.pointerId !== event.pointerId) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (Math.abs(dx)+Math.abs(dy) > 4) pointerMoved = true;
    tx = start.tx + dx * (1000 / Math.max(1, svg.clientWidth));
    ty = start.ty + dy * (620 / Math.max(1, svg.clientHeight));
    apply();
  });
  const end = event => {
    if (!start || start.pointerId !== event.pointerId) return;
    start = null;
    sky.classList.remove("is-dragging");
  };
  sky.addEventListener("pointerup", end);
  sky.addEventListener("pointercancel", end);
  sky.addEventListener("pointerdown", () => sky.classList.add("is-dragging"));
  sky.addEventListener("wheel", event => {
    if (!event.ctrlKey && Math.abs(event.deltaY) < 1) return;
    event.preventDefault();
    const next = Math.min(maxScale, Math.max(minScale, scale * (event.deltaY < 0 ? 1.08 : .92)));
    scale = next; apply();
  }, { passive:false });
  document.querySelector("#reset-view").addEventListener("click", reset);
  return { reset, centerOn(id, positions) {
    const pos = positions.get(id); if (!pos) return;
    tx = 500 - pos.x*scale; ty = 310 - pos.y*scale; apply();
  }};
}
