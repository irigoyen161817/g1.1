const { spawn, spawnSync } = require("child_process");
const path = require("path");
const readline = require("readline");

const VERSION_MINIMA_NODE = 20;
const RAIZ_PROYECTO = path.resolve(__dirname, "..");
const ES_WINDOWS = process.platform === "win32";

const PROYECTOS = [
  { nombre: "raíz", carpeta: RAIZ_PROYECTO },
  { nombre: "backend", carpeta: path.join(RAIZ_PROYECTO, "backend") },
  { nombre: "frontend", carpeta: path.join(RAIZ_PROYECTO, "frontend") },
];

const SERVIDORES = [
  { nombre: "backend", carpeta: path.join(RAIZ_PROYECTO, "backend"), color: "\x1b[34m" },
  { nombre: "frontend", carpeta: path.join(RAIZ_PROYECTO, "frontend"), color: "\x1b[35m" },
];

const procesosActivos = [];
let estaDeteniendo = false;

function comprobarVersionNode() {
  const versionPrincipal = Number(process.versions.node.split(".")[0]);

  if (versionPrincipal < VERSION_MINIMA_NODE) {
    console.error("\x1b[31m%s\x1b[0m", `[ERROR] Se necesita Node.js ${VERSION_MINIMA_NODE} o superior.`);
    console.error(`Versión instalada: ${process.versions.node}. Descarga la actual en https://nodejs.org`);
    process.exit(1);
  }
}

// Desde Node 18.20/20.12, en Windows no se puede lanzar npm.cmd sin shell, así que se usa
// shell en todas las plataformas; los comandos son fijos, sin datos externos que inyectar
function instalarDependencias() {
  for (const { nombre, carpeta } of PROYECTOS) {
    console.log(`\n[instalar] Instalando dependencias de ${nombre}...`);

    const resultado = spawnSync("npm install --no-audit --no-fund", {
      cwd: carpeta,
      stdio: "inherit",
      shell: true,
    });

    if (resultado.status !== 0) {
      console.error("\x1b[31m%s\x1b[0m", `[ERROR] Falló la instalación de dependencias de ${nombre}.`);
      process.exit(resultado.status ?? 1);
    }
  }
}

function mostrarConEtiqueta(flujo, etiqueta, salida) {
  readline.createInterface({ input: flujo }).on("line", (linea) => {
    salida.write(`${etiqueta} ${linea}\n`);
  });
}

// Con shell, el proceso hijo es la shell y npm/vite/nodemon cuelgan de ella. Matar solo la shell
// dejaría los servidores huérfanos ocupando los puertos: en Windows se mata el árbol con
// taskkill /T y en macOS/Linux cada servidor se lanza en su propio grupo (detached) para
// poder enviar la señal al grupo entero con un pid negativo
function detenerProceso(proceso) {
  if (proceso.exitCode !== null || proceso.signalCode !== null) {
    return;
  }

  if (ES_WINDOWS) {
    spawnSync("taskkill", ["/pid", String(proceso.pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }

  try {
    process.kill(-proceso.pid, "SIGTERM");
  } catch {
    // El grupo ya había terminado
  }
}

function detenerServidores(codigoSalida) {
  if (estaDeteniendo) {
    return;
  }

  estaDeteniendo = true;
  console.log("\n[iniciar] Deteniendo backend y frontend...");
  procesosActivos.forEach(detenerProceso);
  process.exit(codigoSalida);
}

function lanzarServidores() {
  for (const { nombre, carpeta, color } of SERVIDORES) {
    const etiqueta = `${color}[${nombre}]\x1b[0m`;
    const proceso = spawn("npm run dev", {
      cwd: carpeta,
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
      detached: !ES_WINDOWS,
    });

    mostrarConEtiqueta(proceso.stdout, etiqueta, process.stdout);
    mostrarConEtiqueta(proceso.stderr, etiqueta, process.stderr);

    proceso.on("exit", () => {
      if (!estaDeteniendo) {
        console.error("\x1b[31m%s\x1b[0m", `[ERROR] El ${nombre} se ha detenido de forma inesperada.`);
        detenerServidores(1);
      }
    });

    procesosActivos.push(proceso);
  }

  console.log("\n[iniciar] Backend: http://localhost:3000 | Frontend: http://localhost:5173");
  console.log("[iniciar] Pulsa Ctrl+C para detener ambos servidores.\n");
}

comprobarVersionNode();
instalarDependencias();
lanzarServidores();

process.on("SIGINT", () => detenerServidores(0));
process.on("SIGTERM", () => detenerServidores(0));
