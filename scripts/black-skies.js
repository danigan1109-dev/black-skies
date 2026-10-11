const MODULE_ID = "black-skies";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Inicializando Black Skies`);
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | Listo`);
});
const MODULE_ID = "black-skies";

// Textos visibles de la ficha que se renombran (solo etiquetas; los datos no cambian).
const RENAMES = {
  "Radiation": "Contaminación",
  "Temporary": "Reversible",
  "Permanent": "Permanente",
  "Unit Morale": "Esperanza",
  "Coolness Under Fire": "Sangre fría"
};

function renameLabels(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue.trim();
    if (!text) continue;
    for (const [from, to] of Object.entries(RENAMES)) {
      if (text.toLowerCase() === from.toLowerCase()) {
        node.nodeValue = node.nodeValue.replace(new RegExp(from, "i"), to);
        break;
      }
    }
  }
}

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Inicializando Black Skies`);
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | Listo`);
});

// V1 (jQuery) y V2 (HTMLElement) de hojas.
Hooks.on("renderActorSheet", (app, html) => {
  const el = html instanceof HTMLElement ? html : html[0];
  if (el) renameLabels(el);
});
Hooks.on("renderActorSheetV2", (app, html) => {
  const el = html instanceof HTMLElement ? html : html[0];
  if (el) renameLabels(el);
});
