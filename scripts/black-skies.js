(() => {

const MODULE_ID = "black-skies";

// Etiquetas visibles que se renombran (los datos internos no cambian).
const RENAMES = [
  ["Add the Unit Morale", "Add Esperanza"],
  ["Moral de la Unidad", "Esperanza"],
  ["Unit Morale", "Esperanza"],
  ["Coolness Under Fire", "Sangre fría"],
  ["Radiation", "Contaminación"],
  ["Temporary", "Reversible"],
  ["Permanent", "Permanente"],
  ["Starving", "Hambriento"],
  ["Dehydrated", "Deshidratado"],
  ["Sleep Deprived", "Privado de sueño"],
  ["Hypothermic", "Hipotermia"],
  ["Slow", "Lenta"],
  ["Fast", "Rápida"]
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
  game.settings.register(MODULE_ID, "journalesCreados", {
    scope: "world", config: false, type: Object, default: {}
  });
});

const JOURNALS = [
  { nombre: "Contaminación y Muro Negro", html: `<h1>Contaminación y Muro Negro</h1>
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
<li><strong>Esperanza</strong> es individual: cada personaje usa el dado de Esperanza de su ficha (D12, D10, D8 o D6). Al invocarla tira ese dado: con éxito (6+) repite una tirada fallida o se quita 1 Estrés; si falla, su dado baja un escalón. Empujar sigue costando Estrés; la Esperanza cuesta escalones.</li>
<li>Puede arriesgar su propio dado para ayudar a un compañero (que repita una tirada o pierda 1 Estrés). Si falla, baja él.</li>
<li>Sube un escalón con un momento de calma, un vínculo con otro personaje o un objetivo cumplido. Baja con bajas, derrotas o perder la base.</li>
<li>En el último escalón el personaje se <strong>rompe</strong>: se paraliza, huye o hace una locura hasta que descanse o alguien le dé un respiro.</li>
<li><strong>Sangre fría (pánico):</strong> con disparos o algo aterrador, cada personaje tira su dado de Sangre fría (6+ aguanta) y puede sumar su dado de Esperanza. Si aguanta solo gracias al dado de Esperanza, esa Esperanza baja un escalón; si fallan los dos, entra en pánico (se paraliza, huye o se queda aturdido) y la Esperanza también baja un escalón.</li>
<li><strong>Estados (iconos del token):</strong> Contaminado (la marca verde, sube con la Contaminación), Perseguido (Atracción alta sobre ti, no descansas bien) y Roto (Esperanza en el último escalón).</li>
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
` },
  { nombre: "Bestiario: los Intrusos", html: `<h1>Bestiario: los Intrusos</h1>
<p><em>Criaturas de Black Skies adaptadas al motor Year Zero. Proyecto de fans, no oficial.</em></p>
<p><strong>Cómo leer las fichas.</strong> Los dados usan letras: <strong>A = D12, B = D10, C = D8, D = D6</strong>. <strong>Salud</strong> son las casillas que hay que marcar para derribarlo. <strong>Armadura</strong> es el dado que resta daño. <strong>Estrés</strong> es lo que ganan los personajes. <strong>Cont.</strong> es la Contaminación que causa.</p>

<h2>Centinela</h2>
<p>Figura alta con armadura negra que se confunde con la oscuridad y sensores azules que giran solos. Patrulla el Muro Negro y los laboratorios. Silencioso, metódico, sin piedad.</p>
<p><strong>Salud 3 · Armadura C · Ataque: Golpe B / Rayo B (alcance)</strong></p>
<ul>
<li><strong>Aura de pánico:</strong> a menos de 10 metros, tirada de calma o ganas 1 Estrés y haces ruido (+1 Atracción).</li>
<li><strong>Escanear:</strong> los que se mueven en su campo de visión tiran Sigilo; si fallan, te detecta.</li>
<li><strong>Alarma:</strong> acción rápida. Atracción +2 y llegan refuerzos.</li>
<li><strong>Carga:</strong> si te alcanza, te inmoviliza hasta que superes una tirada de Fuerza.</li>
<li>Cont.: +1 si pasas la escena a su lado.</li>
</ul>

<h2>Psiónico</h2>
<p>Esbelto, de piel translúcida y ojos sin pupila que brillan en violeta. Flota despacio. Manipula desde lejos y rara vez pelea.</p>
<p><strong>Salud 2 · Armadura: barrera psíquica (absorbe 2 ataques) · Ataque: Intrusión mental C</strong></p>
<ul>
<li><strong>Susurro:</strong> el objetivo tira calma o gana 2 Estrés.</li>
<li><strong>Control:</strong> un personaje con Estrés al máximo obedece una orden durante una acción.</li>
<li><strong>Distorsión:</strong> la zona tiene un dado menos en Percepción.</li>
<li>Cont.: +1 por escena a la vista.</li>
</ul>

<h2>Dromín</h2>
<p>Vehículo flotante de metal oscuro con vetas verdes y violetas. Patrulla zonas clave y destruye todo lo que se mueve.</p>
<p><strong>Salud 4 · Armadura B · Ataque: Cañón A (daño alto) / Ametralladora C (ráfaga)</strong></p>
<ul>
<li><strong>Foco:</strong> ilumina una zona. Quien está dentro no puede esconderse.</li>
<li><strong>Persecución:</strong> es más rápido que un vehículo humano y solo se le puede esquivar con una tirada difícil.</li>
<li>Solo le hacen daño real las armas pesadas o el ataque a un punto débil que el grupo haya descubierto.</li>
<li>Cont.: +1 si vas dentro de uno capturado.</li>
</ul>

<h2>Convertido</h2>
<p>Humanos con implantes alienígenas. Piel marcada con circuitos verdes y ojos vacíos. Obedecen sin voluntad, y antes eran personas.</p>
<p><strong>Salud 2 · Armadura D (en algunas zonas) · Ataque: Golpe C / Arma humana C</strong></p>
<ul>
<li><strong>Reconocer:</strong> si el personaje conoció al Convertido, tira calma o gana 1 Estrés.</li>
<li><strong>Enjambre:</strong> si hay 3 o más, atacan con un dado extra.</li>
<li>Débil ante armas de energía.</li>
<li>Cont.: +1 si recibes su golpe.</li>
</ul>

<h2>Aporreador</h2>
<p>Criatura masiva de piel gris azulada con placas naturales y manos como mazos. Agresivo y directo: derriba lo que encuentra.</p>
<p><strong>Salud 4 · Armadura C · Ataque: Aplastar A</strong></p>
<ul>
<li><strong>Derribo:</strong> si impacta, el personaje cae y pierde su próxima acción rápida.</li>
<li><strong>Embestida:</strong> derriba muros y cobertura ligera.</li>
<li>Resiste balas convencionales; sufre con armas pesadas y de energía.</li>
</ul>

<h2>Manipulador de Entorno</h2>
<p>Fusionado con el terreno mediante raíces y cables. Lento. No ataca de frente: tiende trampas.</p>
<p><strong>Salud 2 · Armadura: camuflaje (un dado menos para atacarlo) · Ataque: ninguno directo</strong></p>
<ul>
<li><strong>Alterar terreno:</strong> el suelo se vuelve resbaladizo o inestable. Tirada de Movimiento para no caer.</li>
<li><strong>Distorsión:</strong> el aire vibra, un dado menos en Percepción.</li>
<li>Cont.: +1 por hora en su zona.</li>
</ul>

<h2>Recolector</h2>
<p>Alto, delgado, con varios brazos largos y luces que reaccionan al movimiento. Captura humanos para experimentar.</p>
<p><strong>Salud 2 · Armadura D · Ataque: Captura C</strong></p>
<ul>
<li><strong>Captura:</strong> inmoviliza a un personaje y se lo lleva. Si el grupo no reacciona en 2 escenas, se pierde.</li>
<li>Evita el combate y huye si recibe daño.</li>
<li>Cont.: +1 a quien capturan.</li>
</ul>

<h2>Mentor</h2>
<p>Cabeza grande, ojos brillantes y piel luminosa que cambia de color según su ánimo. Dirige a los demás por telepatía.</p>
<p><strong>Salud 3 · Armadura: campo psíquico (se debilita con ataques mentales) · Ataque: Dominio B</strong></p>
<ul>
<li><strong>Control mental:</strong> toma el control de un personaje con Estrés al máximo durante una escena.</li>
<li><strong>Coordinar:</strong> los Intrusos cercanos atacan con un dado extra.</li>
<li>Cont.: +2 por escena en su presencia.</li>
</ul>

<h2>Ser de Energía Pura</h2>
<p>Esfera o nube de luz pulsante, sin cuerpo. Provoca confusión y miedo y se alimenta de la energía psíquica.</p>
<p><strong>Salud: inmaterial · Solo le afectan los ataques psíquicos o tecnología alienígena</strong></p>
<ul>
<li><strong>Alucinaciones:</strong> los cercanos ganan 1 Estrés por escena.</li>
<li><strong>Drenaje:</strong> baja un escalón la Esperanza de uno de los cercanos cada escena sin resolverse.</li>
<li>Cont.: +1 por escena.</li>
</ul>
` }
];

Hooks.once("ready", async () => {
  console.log(`${MODULE_ID} | Listo (renombrado v2 + diarios)`);
  if (!game.user.isGM) return;
  const hechos = foundry.utils.deepClone(game.settings.get(MODULE_ID, "journalesCreados") ?? {});
  let cambios = false;
  for (const j of JOURNALS) {
    if (hechos[j.nombre] >= 3) continue;
    const ex = game.journal.getName(j.nombre);
    if (ex) {
      const pg = ex.pages.contents[0];
      if (pg) await pg.update({ "text.content": j.html });
    } else {
      await JournalEntry.create({
        name: j.nombre,
        pages: [{ name: j.nombre, type: "text", text: { format: 1, content: j.html } }]
      });
      ui.notifications.info(`Black Skies: diario "${j.nombre}" creado.`);
    }
    hechos[j.nombre] = 3;
    cambios = true;
  }
  if (cambios) await game.settings.set(MODULE_ID, "journalesCreados", hechos);
});

// Estados propios de Black Skies (iconos del token)
Hooks.once("ready", () => {
  const extra = [
    { id: "contaminado", name: "Contaminado", label: "Contaminado", img: "icons/svg/biohazard.svg" },
    { id: "perseguido", name: "Perseguido", label: "Perseguido", img: "icons/svg/eye.svg" },
    { id: "roto", name: "Roto", label: "Roto", img: "icons/svg/terror.svg" }
  ];
  for (const e of extra) {
    if (!CONFIG.statusEffects.some(s => s.id === e.id)) CONFIG.statusEffects.push(e);
  }
});

// Cualquier ventana renderizada (V1 jQuery o V2 HTMLElement).
function handler(app, html) {
  const el = html instanceof HTMLElement ? html : (html?.[0] ?? app?.element?.[0] ?? app?.element);
  if (el instanceof HTMLElement && (el.matches(".cuf-dialog") || el.querySelector(".sheet-header, .sheet-body, .cuf-dialog"))) {
    renameLabels(el);
    setTimeout(() => renameLabels(el), 150);
  }
}
Hooks.on("renderApplication", handler);
Hooks.on("renderActorSheet", handler);
Hooks.on("renderApplicationV2", handler);

// Roles: se arrastran a la ficha, suben un escalon las habilidades indicadas y añaden sus especialidades y equipo.
// Al borrar el rol de la ficha se deshace todo.
const ESCALONES = ["D", "C", "B", "A"];
const ETIQUETAS = {
  heavyWeapons: "Armas pesadas", closeCombat: "Cuerpo a cuerpo", stamina: "Aguante", driving: "Conducción",
  mobility: "Movilidad", rangedCombat: "Combate a distancia", recon: "Reconocimiento", survival: "Supervivencia",
  tech: "Tecnología", command: "Mando", persuasion: "Persuasión", medicalAid: "Primeros auxilios",
  str: "Fuerza", agl: "Agilidad", int: "Intelecto", emp: "Empatía"
};
function subeLetra(l) {
  const i = ESCALONES.indexOf(l);
  if (i < 0) return "D";
  return i >= 3 ? null : ESCALONES[i + 1];
}
function avisoRol(actor, texto) {
  ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: "<p>" + texto + "</p>" });
}

Hooks.on("createItem", async (item, _opts, userId) => {
  try {
    if (userId !== game.user.id) return;
    const actor = item.parent;
    const rol = item.getFlag(MODULE_ID, "rol");
    if (!actor || !rol) return;
    if (item.getFlag(MODULE_ID, "aplicado")?.actor === actor.id) return;
    if (!["character", "npc"].includes(actor.type)) return;
    const upd = {};
    const cambios = [];
    const grupos = [["skills", rol.habilidades ?? []], ["attributes", rol.atributos ?? []]];
    for (const [grupo, claves] of grupos) {
      for (const k of claves) {
        const ruta = "system." + grupo + "." + k + ".score";
        const de = foundry.utils.getProperty(actor, ruta) ?? "";
        const a = subeLetra(de);
        if (!a) continue;
        upd[ruta] = a;
        cambios.push({ ruta, k, de, a });
      }
    }
    const nuevos = [];
    for (const nombre of [...(rol.especialidades ?? []), ...(rol.equipo ?? [])]) {
      if (actor.items.some(i => i.name === nombre)) continue;
      const base = game.items.getName(nombre);
      if (!base) continue;
      const o = base.toObject();
      delete o._id;
      nuevos.push(o);
    }
    const creados = nuevos.length ? await actor.createEmbeddedDocuments("Item", nuevos) : [];
    if (Object.keys(upd).length) await actor.update(upd);
    await item.setFlag(MODULE_ID, "aplicado", { actor: actor.id, cambios, items: creados.map(i => i.id) });
    const partes = cambios.map(c => (ETIQUETAS[c.k] ?? c.k) + " " + (c.de || "–") + " → " + c.a);
    if (creados.length) partes.push("añade: " + creados.map(i => i.name).join(", "));
    avisoRol(actor, "<strong>" + item.name + "</strong>: " + (partes.join(" · ") || "sin cambios"));
  } catch (e) { console.warn("black-skies | fallo al aplicar rol", e); }
});

Hooks.on("deleteItem", async (item, _opts, userId) => {
  try {
    if (userId !== game.user.id) return;
    const actor = item.parent;
    const ap = item.getFlag(MODULE_ID, "aplicado");
    if (!actor || !ap || ap.actor !== actor.id || !game.actors.has(actor.id)) return;
    const upd = {};
    for (const c of ap.cambios ?? []) {
      if (foundry.utils.getProperty(actor, c.ruta) === c.a) upd[c.ruta] = c.de;
    }
    const ids = (ap.items ?? []).filter(id => actor.items.has(id));
    if (ids.length) await actor.deleteEmbeddedDocuments("Item", ids);
    if (Object.keys(upd).length) await actor.update(upd);
    avisoRol(actor, "<strong>" + item.name + "</strong> retirado: se deshacen sus cambios.");
  } catch (e) { console.warn("black-skies | fallo al quitar rol", e); }
});
})();
