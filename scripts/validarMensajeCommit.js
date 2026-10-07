const fs = require("fs");

function validarMensajeCommit() {
  const rutaArchivoMensaje = process.argv[2];

  if (!rutaArchivoMensaje) {
    return;
  }

  const contenidoArchivo = fs.readFileSync(rutaArchivoMensaje, "utf-8");
  const primeraLinea = contenidoArchivo.split("\n")[0].trim();

  if (primeraLinea.startsWith("Merge ") || primeraLinea.startsWith("Revert ")) {
    return;
  }

  const patronCommit = /^HHUU\d{2,}: [a-z0-9áéíóúñü](?:.*[^.])?$/;

  const tieneFormatoValido = patronCommit.test(primeraLinea) && !primeraLinea.endsWith(".");

  if (!tieneFormatoValido) {
    console.error("\x1b[31m%s\x1b[0m", "[ERROR] El mensaje de commit no cumple con CONTRIBUTING.md.");
    console.error(`Mensaje recibido: "${primeraLinea}"`);
    console.error("Formato requerido: <ID-HHUU>: <mensaje en minusculas>");
    console.error("Reglas:");
    console.error("- <ID-HHUU> debe ir en mayusculas (ej. HHUU00, HHUU01).");
    console.error("- La descripcion debe empezar en minusculas.");
    console.error("- No debe terminar con punto final.");
    console.error("Ejemplo valido: HHUU00: iniciar repositorio y archivo gitignore");
    process.exit(1);
  }
}

validarMensajeCommit();
