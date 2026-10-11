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
  game.settings.register(MODULE_ID, "journalCreado", {
    scope: "world", config: false, type: Boolean, default: false
  });
});

const JOURNAL_NOMBRE = "Contaminación y Muro Negro";
const JOURNAL_HTML = `<h1>Contaminación y Muro Negro</h1>
<p><em>Reglas propias de Black Skies, pensadas para usarse sobre el motor Year Zero. Proyecto de fans, no oficial.</em></p>

<h2>1. Contaminación (0 a 10)</h2>
<p>Es la marca que deja la atmósfera verde y lo alienígena en el cuerpo. Se anota en las casillas de la ficha: las <strong>reversibles</strong> se pueden limpiar; las <strong>permanentes</strong> no.</p>
<h3>Cómo sube</h3>
<ul>
<li>Pasar tiempo en zona verde: <strong>+1</strong> por hora de exposición (+2 si es una zona densa).</li>
<li>Usar tecnología alienígena de forma prolongada: <strong>+1</strong>.</li>
<li>Estar cerca de un Convertido o Centinela con capacidad psíquica: <strong>+1</strong> por escena.</li>
<li>Cada vez que el total cruza <strong>4, 7 y 10</strong>, una casilla reversible pasa a permanente.</li>
</ul>
<h3>Efectos</h3>
<table border="1" cellpadding="4">
<tr><th>Nivel</th><th>Efecto</th></tr>
<tr><td>1–3</td><td>Náuseas. Mientras estés expuesto, tienes un dado menos en Resistencia.</td></tr>
<tr><td>4–5</td><td>Desorientación. Un dado menos en Percepción y en tiradas para mantener la calma.</td></tr>
<tr><td>6–7</td><td>Susurros y alucinaciones. Ganas 1 Estrés al entrar en este nivel y el Máster puede pedirte una tirada de calma cada escena de tensión.</td></tr>
<tr><td>8–9</td><td>Fallo orgánico. Pierdes 1 de Salud por día en zona contaminada. Necesitas cuidados.</td></tr>
<tr><td>10</td><td>Transformación. El personaje pasa a ser controlado por el Máster: se convierte en un Convertido.</td></tr>
</table>
<h3>Cómo se limpia (solo lo reversible)</h3>
<ul>
<li><strong>Descanso en zona limpia:</strong> un día entero resguardado permite una tirada de Resistencia; si sale bien, −1.</li>
<li><strong>Medicinas escasas:</strong> −1 o −2 por dosis. Cada dosis es difícil de encontrar.</li>
<li><strong>Tecnología de purificación alienígena:</strong> −2 o −3, pero usarla puede costar otro punto de Contaminación o Estrés.</li>
</ul>

<h2>2. Estrés y Esperanza</h2>
<ul>
<li>El Estrés sube por la Contaminación (ver arriba), por el miedo y por empujar tiradas.</li>
<li><strong>Esperanza</strong> es un recurso del grupo. Se gasta 1 punto para repetir una tirada fallida o para quitar 1 Estrés a un compañero.</li>
<li>Los puntos de Esperanza se ganan con momentos de calma, de unión o al cumplir objetivos del refugio. Se pierden cuando el grupo sufre una baja o pierde su base.</li>
<li>Con la Esperanza a 0, el grupo cae en la <strong>Desesperanza</strong>: no puede quitar Estrés ni descansar bien hasta lograr un momento de respiro.</li>
</ul>

<h2>3. Atracción (reloj de alerta)</h2>
<p>Un contador de 0 a 6 que lleva el Máster. Sube con el ruido, las luces, los disparos y el uso de tecnología.</p>
<table border="1" cellpadding="4">
<tr><th>Atracción</th><th>Qué ocurre</th></tr>
<tr><td>0–1</td><td>Silencio. Nadie os ha notado.</td></tr>
<tr><td>2–3</td><td>Rastros: huellas, ecos y sombras. Los Centinelas patrullan cerca.</td></tr>
<tr><td>4</td><td>Aparece una patrulla de Centinelas buscándoos.</td></tr>
<tr><td>5</td><td>Llegan Convertidos y se cierran las salidas.</td></tr>
<tr><td>6</td><td>Cacería: todo lo que hay en la zona va a por vosotros.</td></tr>
</table>
<p>La Atracción baja 1 punto por cada hora de ocultación total o al abandonar la zona.</p>

<h2>4. Muro Negro</h2>
<p>Una barrera oscura que rodea las zonas controladas por los Intrusos. Acercarse a ella es lo más peligroso del juego.</p>
<ul>
<li><strong>Cuenta atrás:</strong> al entrar en la zona del Muro, el grupo tiene tantas escenas como el Máster haya fijado (3 a 6). En cada una sube la Contaminación en +1.</li>
<li><strong>Visibilidad:</strong> la luz no funciona de forma normal. Todas las tiradas de Percepción pierden 1 dado.</li>
<li><strong>Peligro creciente:</strong> cada escena dentro del Muro sube también la Atracción en +1.</li>
<li><strong>Cruzar:</strong> exige una tirada de Resistencia con pérdida de Estrés si falla. Quien lo cruza ya no vuelve igual: gana 1 casilla permanente de Contaminación.</li>
</ul>
`;

Hooks.once("ready", async () => {
  console.log(`${MODULE_ID} | Listo (renombrado v2 + diario)`);
  if (!game.user.isGM) return;
  if (game.settings.get(MODULE_ID, "journalCreado")) return;
  if (game.journal.getName(JOURNAL_NOMBRE)) {
    await game.settings.set(MODULE_ID, "journalCreado", true);
    return;
  }
  await JournalEntry.create({
    name: JOURNAL_NOMBRE,
    pages: [{ name: JOURNAL_NOMBRE, type: "text", text: { format: 1, content: JOURNAL_HTML } }]
  });
  await game.settings.set(MODULE_ID, "journalCreado", true);
  ui.notifications.info("Black Skies: diario \"Contaminación y Muro Negro\" creado.");
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
