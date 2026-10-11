(() => {
const MODULE_ID = "black-skies";

// Etiquetas visibles que se renombran (los datos internos no cambian).
const RENAMES = [
  ["Unit Morale", "Esperanza"],
  ["Coolness Under Fire", "Sangre fría"],
  ["Radiation", "Contaminación"],
  ["Temporary", "Reversible"],
  ["Permanent", "Permanente"]
];

function renameLabels(root) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  for (const node of nodes) {
    let v = node.nodeValue;
    if (!v || !v.trim()) continue;
    let out = v;
    for (const [from, to] of RENAMES) {
      out = out.replace(new RegExp(`\\b${from}\\b`, "gi"), to);
    }
    if (out !== v) node.nodeValue = out;
  }
}

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Inicializando Black Skies`);
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | Listo (renombrado v2)`);
});

// Cualquier ventana renderizada (V1 jQuery o V2 HTMLElement).
function handler(app, html) {
  const el = html instanceof HTMLElement ? html : (html?.[0] ?? app?.element?.[0] ?? app?.element);
  if (el instanceof HTMLElement && el.querySelector(".sheet-header, .sheet-body")) {
    renameLabels(el);
    setTimeout(() => renameLabels(el), 150);
  }
}
Hooks.on("renderApplication", handler);
Hooks.on("renderActorSheet", handler);
Hooks.on("renderApplicationV2", handler);

})();
