# Proyecto EduQuest G1.1

Proyecto de desarrollo de la asignatura GPI1.

## Requisitos

- Node.js 20 o superior.
- npm.

## Inicio rápido

Desde la raíz del repositorio, con solo Node.js instalado:

```bash
npm start
```

Este comando instala o actualiza las dependencias de la raíz, `backend` y `frontend`, y después levanta los dos servidores en modo desarrollo en la misma terminal, con la salida de cada uno etiquetada como `[backend]` o `[frontend]`:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

Pulsa `Ctrl+C` para detener los dos a la vez. Si uno de ellos se detiene de forma inesperada, el otro también se detiene. Se puede volver a ejecutar en cualquier momento, por ejemplo después de cambiar de rama, para sincronizar las dependencias con los `package-lock.json`.

## Instalación

Si prefieres instalar y ejecutar cada aplicación por separado, el proyecto está dividido en dos aplicaciones independientes. Es necesario instalar las dependencias de cada una:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

## Ejecución

### Backend

Desde la carpeta `backend`:

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`.

Para ejecutarlo en modo desarrollo con reinicio automático:

```bash
npm run dev
```

### Frontend

Desde la carpeta `frontend`:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local donde se sirve la aplicación, normalmente `http://localhost:5173`.

## Calidad y formato del código

Cada aplicación usa ESLint para detectar errores y Prettier para imponer el formato. Desde la raíz del repositorio (tras ejecutar `npm install` para activar Husky) están disponibles estos comandos:

```bash
npm run lint           # ESLint en frontend y backend
npm run format         # aplica Prettier a frontend y backend
npm run format:check   # comprueba el formato sin modificar archivos
```

El hook `pre-commit` y el pipeline de GitLab CI ejecutan `format:check`, por lo que un código sin formatear impide el commit y hace fallar el stage `lint`.

## Arquitectura base

El proyecto utiliza una arquitectura separada en dos aplicaciones:

- `backend/`: servidor HTTP desarrollado con Node.js y Express. El punto de entrada es `index.js` y expone endpoints de la API como `GET /api/tematicas`, `GET /api/preguntas` y `POST /api/corregir`.
- `frontend/`: aplicación cliente desarrollada con React y Vite. El código principal se encuentra en `src/`, con `App.jsx` como componente principal y `main.jsx` como punto de entrada. La selección de temáticas se gestiona desde `components/SeleccionTematica.jsx` y el cuestionario se coordina desde `components/PantallaPregunta.jsx`, acompañado de componentes independientes para el progreso, las opciones, la navegación y la pantalla final (`components/PantallaFinalCuestionario.jsx`).
  - **Flujo de corrección de cuestionarios:** al elegir una temática en `SeleccionTematica`, se propagan como props hacia `PantallaPregunta` el `tematicaId`, las `preguntas` y el callback `alSalir`. Tras responder a la última pregunta, el cliente envía una petición `POST /api/corregir` con el cuerpo `{ tematicaId, respuestas: [{ idPregunta, indiceRespuesta }] }`. Al recibir la respuesta del servidor, `PantallaPregunta` pasa las props `resultado` (con el resultado validado de la corrección), `totalPreguntas`, `preguntas` y `alSalir` a `PantallaFinalCuestionario`.
  - **Formato del código:** ambas aplicaciones usan Prettier (con `eslint-config-prettier` para evitar conflictos con ESLint) y una configuración propia en `.prettierrc.json` que respeta el estilo que ya tenía cada una: el backend con punto y coma y sin comas finales, el frontend sin punto y coma y con comas finales. Ambas usan comillas simples, 2 espacios de sangría y un ancho de 100 columnas. `backend/datos/` queda excluido del formateo.
  - **Navegación entre vistas e historial:** `App.jsx` mantiene en el estado `vistaActiva` si se muestra la selección de temáticas (`SeleccionTematica`) o el panel de historial (`components/PanelHistorial.jsx`), sin librería de rutas. El botón `Ver historial` vive en `components/AccesoHistorial.jsx`, que `SeleccionTematica` renderiza con el callback `alVerHistorial`; `PanelHistorial` recibe `alVolver` para regresar. El panel carga `GET /api/historial` (`historial` y `estadisticas`), cancela la petición si se sale de él mientras carga, gestiona los estados de carga, error con reintento e historial vacío, y deja los contenedores `contenedor-evolucion` y `contenedor-estadisticas-categoria` preparados para la evolución y las estadísticas por categoría.
  - **Límite de partidas recientes (decisión técnica):** el historial en memoria del backend crece con cada cuestionario y no está paginado, por lo que el panel muestra como máximo las 10 partidas más recientes (constante `MAXIMO_PARTIDAS_RECIENTES` en `PanelHistorial.jsx`).
  - **Diseño de temáticas e historial:** estas dos pantallas siguen el diseño "Cognitive Clarity". Sus colores y fuentes se definen como variables CSS en `src/vistaDiseno.css`, con ámbito en la clase `.vista-diseno` (no en `:root`), de modo que el resto de la aplicación conserva su estilo. Los estilos propios están en `components/PanelHistorial.css` y `components/AccesoHistorial.css` (mobile first).
  - **Tipografía:** Hanken Grotesk y Space Grotesk se sirven desde el propio proyecto con las dependencias `@fontsource/hanken-grotesk` y `@fontsource/space-grotesk` (importadas en `src/main.jsx`), sin peticiones a servicios externos.
- `scripts/`: scripts auxiliares del proyecto.
  - **Arranque único (`scripts/iniciar.js`, `npm start` en la raíz):** script de Node sin dependencias externas, para que funcione en un clon recién hecho antes de instalar nada. Ejecuta `npm install` en la raíz, `backend/` y `frontend/`, y lanza `npm run dev` en las dos aplicaciones. Al pulsar `Ctrl+C`, o si uno de los dos servidores termina, detiene ambos: en Windows mata el árbol de procesos con `taskkill /T` y en macOS/Linux lanza cada servidor en su propio grupo de procesos, para no dejar servidores huérfanos ocupando los puertos.
- `.gitlab/`: configuración y plantillas utilizadas por GitLab.
- `.husky/`: hooks de Git para automatizar comprobaciones del flujo de trabajo.
- `CONTRIBUTING.md`: convenciones de nomenclatura, calidad y contribución.

El frontend y el backend se ejecutan como procesos independientes durante el desarrollo. La comunicación entre ambos se ampliará mediante endpoints de la API y la configuración correspondiente de Vite a medida que avance el proyecto.

### Historial de Cuestionarios
El backend mantiene un registro en memoria de los cuestionarios completados.
- **Almacenamiento:** Array en memoria en el servidor (se reinicia al apagar el servidor).
- **Alimentación:** El endpoint `POST /api/corregir` añade automáticamente una entrada al historial cada vez que se corrige un cuestionario con éxito.
- **Consultas:** La función `obtenerHistorial` permite leer el array, aunque de momento no se expone por ningún endpoint.
- **Modelo de datos:**
```json
{
  "id": "hist-1",
  "fecha": "2026-10-16T10:30:00.000Z",
  "tematicaId": "cat-filosofia",
  "tematicaNombre": "Filosofía",
  "aciertos": 4,
  "total": 5,
  "nota": 8
}
```

## Flujo de contribución

Las ramas, commits y merge requests deben seguir las reglas definidas en `CONTRIBUTING.md`. Todo cambio debe revisarse mediante una merge request antes de incorporarse a `main`.