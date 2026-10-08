const { execSync } = require("child_process");

function obtenerRamaActual() {
  return execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim();
}

function validarRama() {
  const nombreRama = obtenerRamaActual();

  if (nombreRama === "HEAD") {
    return;
  }

  if (nombreRama === "main") {
    console.error("\x1b[31m%s\x1b[0m", "[ERROR] Esta prohibido realizar commits directamente en la rama 'main'.");
    console.error("Crea una rama siguiendo el formato: <tipo>/<id-tarea>-<descripcion-corta>");
    process.exit(1);
  }

  const patronRama = /^(feat|fix|docs|chore|refactor|test)\/T\d+(\.\d+)?-[a-z0-9]+(-[a-z0-9]+)*$/;

  if (!patronRama.test(nombreRama)) {
    console.error("\x1b[31m%s\x1b[0m", `[ERROR] El nombre de la rama '${nombreRama}' no cumple con CONTRIBUTING.md.`);
    console.error("Formato requerido: <tipo>/<id-tarea>-<descripcion-corta>");
    console.error("Tipos validos: feat, fix, docs, chore, refactor, test");
    console.error("Ejemplo valido: feat/T0.2-instanciar-frontend");
    process.exit(1);
  }
}

validarRama();
