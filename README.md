# Black Skies

Módulo para Foundry VTT. Adapta al sistema Twilight: 2000 (Free League, motor Year Zero) la contaminación, el Muro Negro y los alienígenas del universo Black Skies.

Estado: esqueleto. Los compendios `alienigenas` y `reglas` están vacíos y se irán llenando por bloques.

## Instalar en Foundry

1. En Foundry, ve a Configuración > Módulos complementarios > Instalar módulo.
2. Pega este enlace en "URL del manifiesto":

   `https://github.com/danigan1109-dev/black-skies/releases/latest/download/module.json`

3. Instala y activa el módulo dentro de un mundo de Twilight: 2000.

## Estructura

- `module.json`: manifiesto del módulo.
- `packs/`: compendios (alienígenas y reglas).
- `scripts/`: código del módulo.
- `styles/`: estilos.
- `languages/`: traducciones (español).

## Publicar una versión

1. Sube los cambios a la rama `main`.
2. En GitHub, crea una Release con una etiqueta tipo `v0.1.0`.
3. El flujo automático genera `module.json` y `module.zip` y los adjunta a la release.
