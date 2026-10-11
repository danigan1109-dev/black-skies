(() => {
  const ID = "black-skies";
  Hooks.once("init", () => {
    game.settings.register(ID, "contenidoCreado", { scope: "world", config: false, type: Object, default: {} });
  });
  Hooks.once("ready", async () => {
    if (!game.user.isGM) return;
    let data;
    try { data = await (await fetch(`modules/${ID}/contenido/contenido.json`)).json(); }
    catch (e) { console.warn("black-skies | no se pudo leer contenido.json", e); return; }
    const hecho = foundry.utils.deepClone(game.settings.get(ID, "contenidoCreado") || {});
    const carpetas = {};
    const carpeta = async (nombre, tipo) => {
      const k = `${tipo}:${nombre}`;
      if (carpetas[k]) return carpetas[k];
      let raiz = game.folders.find(f => f.type === tipo && f.name === data.carpetaRaiz && !f.folder);
      if (!raiz) raiz = await Folder.create({ name: data.carpetaRaiz, type: tipo });
      let sub = game.folders.find(f => f.type === tipo && f.name === nombre && f.folder?.id === raiz.id);
      if (!sub) sub = await Folder.create({ name: nombre, type: tipo, folder: raiz.id });
      return (carpetas[k] = sub.id);
    };
    const revJ = data.revisionDiarios ?? data.version;
    for (const j of data.journals) {
      const clave = `J:${j.nombre}`;
      if (hecho[clave] >= revJ) continue;
      try {
        const existente = game.journal.getName(j.nombre);
        if (existente) {
          for (const p of j.paginas) {
            const pg = existente.pages.getName(p.nombre);
            if (pg) await pg.update({ "text.content": p.html });
            else await existente.createEmbeddedDocuments("JournalEntryPage", [{ name: p.nombre, type: "text", text: { content: p.html, format: 1 } }]);
          }
        } else {
          await JournalEntry.create({
            name: j.nombre,
            folder: await carpeta(j.carpeta, "JournalEntry"),
            pages: j.paginas.map(p => ({ name: p.nombre, type: "text", text: { content: p.html, format: 1 } }))
          });
        }
        hecho[clave] = revJ;
      } catch (e) { console.warn("black-skies | fallo journal", j.nombre, e); }
    }
    const tipos = game.documentTypes?.Actor ?? [];
    for (const a of data.actores) {
      const clave = `A:${a.nombre}`;
      if (hecho[clave] >= data.version) continue;
      try {
        const tipo = tipos.includes(a.tipo) ? a.tipo : (tipos.includes("character") ? "character" : tipos[0]);
        await Actor.create({ name: a.nombre, type: tipo, folder: await carpeta(a.carpeta, "Actor") });
        hecho[clave] = data.version;
      } catch (e) { console.warn("black-skies | fallo actor", a.nombre, e); }
    }
    const tiposItem = game.documentTypes?.Item ?? [];
    const revO = data.revisionObjetos ?? data.version;
    for (const o of data.objetos ?? []) {
      const clave = `O:${o.nombre}`;
      if (hecho[clave] >= revO) continue;
      try {
        const tipo = tiposItem.includes(o.tipo) ? o.tipo : (tiposItem.includes("gear") ? "gear" : tiposItem[0]);
        const sistema = foundry.utils.mergeObject({ description: o.descripcion }, o.system ?? {}, { inplace: false });
        const existente = game.items.getName(o.nombre);
        if (existente) await existente.update({ system: sistema });
        else await Item.create({ name: o.nombre, type: tipo, folder: await carpeta(o.carpeta, "Item"), system: sistema });
        hecho[clave] = revO;
      } catch (e) { console.warn("black-skies | fallo objeto", o.nombre, e); }
    }
    await game.settings.set(ID, "contenidoCreado", hecho);
    console.log("black-skies | contenido listo");
  });
})();
