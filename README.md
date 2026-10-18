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
- `frontend/`: aplicación cliente desarrollada con React y Vite. El código principal se encuentra en `src/`, con `App.jsx` como componente principal y `main.jsx` como punto de entrada. La selección de temáticas se gestiona desde `components/SeleccionTematica.jsx` y el cuestionario se coordina desde `components/PantallaPregunta.jsx`, acompañado de componentes independientes para el progreso, las opciones, la navegación, la pantalla de resumen (`components/ResumenCuestionario.jsx`) y el detalle de preguntas acertadas y falladas (`components/DetallePregunta.jsx`). La visualización de la evolución del usuario se dibuja mediante gráficas utilizando la librería `recharts` en el componente `components/EvolucionHistorial.jsx`.
  - **Flujo de corrección de cuestionarios y resumen:** al elegir una temática en `SeleccionTematica`, se propagan como props hacia `PantallaPregunta` el `tematicaId`, las `preguntas` y el callback `alSalir`. Tras responder a la última pregunta, el cliente envía una petición `POST /api/corregir` con el cuerpo `{ tematicaId, respuestas: [{ idPregunta, indiceRespuesta }] }`. Al recibir la respuesta del servidor, `PantallaPregunta` valida que incluya `aciertos`, `fallos` y `nota` numéricos y `detalle` como lista, y pasa las props `resultado`, `preguntas` y `alSalir` a `ResumenCuestionario`, que presenta la puntuación final (`nota/10`), las métricas de aciertos y fallos (el total de preguntas se obtiene como `aciertos + fallos`), el detalle de cada pregunta mediante `DetallePregunta` (enunciado, respuesta elegida y, en los fallos, la respuesta correcta, cruzando `detalle[].idPregunta` con las `preguntas` recibidas) y la acción para volver a la selección de temáticas reiniciando el cuestionario.
  - **Formato del código:** ambas aplicaciones usan Prettier (con `eslint-config-prettier` para evitar conflictos con ESLint) y una configuración propia en `.prettierrc.json` que respeta el estilo que ya tenía cada una: el backend con punto y coma y sin comas finales, el frontend sin punto y coma y con comas finales. Ambas usan comillas simples, 2 espacios de sangría y un ancho de 100 columnas. `backend/datos/` queda excluido del formateo.
  - **Navegación entre vistas e historial:** `App.jsx` mantiene en el estado `vistaActiva` si se muestra la selección de temáticas (`SeleccionTematica`) o el panel de historial (`components/PanelHistorial.jsx`), sin librería de rutas. El botón `Ver historial` vive en `components/AccesoHistorial.jsx`, que `SeleccionTematica` renderiza con el callback `alVerHistorial`; `PanelHistorial` recibe `alVolver` para regresar. El panel carga `GET /api/historial` (`historial` y `estadisticas`), cancela la petición si se sale de él mientras carga, gestiona los estados de carga, error con reintento e historial vacío, y pinta en `contenedor-evolucion` la gráfica de evolución de las notas (`EvolucionHistorial`) y en `contenedor-estadisticas-categoria` las estadísticas por categoría (`EstadisticasCategorias`).
  - **Estadísticas por categoría:** `components/EstadisticasCategorias.jsx` recibe `estadisticas` por props y dibuja con `recharts` (`BarChart` dentro de `ResponsiveContainer`) una barra por temática con su `notaMedia` tal como la devuelve el backend, sin recalcularla, y el eje Y de 0 a 10. Bajo cada barra muestra el nombre de la temática y el número de tests (`totalTests`), que también aparecen en el tooltip. Las barras se colorean según la nota con el mismo criterio que las partidas del historial (`obtenerClaseNota`), y si no hay estadísticas se muestra un mensaje. Como el texto SVG no hace saltos de línea, los nombres largos se dividen en varias líneas para que las etiquetas no se solapen en móvil. Sus estilos están en `components/EstadisticasCategorias.css` (mobile first).
  - **Gráficos (dependencia):** `recharts` es la librería de gráficos del frontend.
  - **Límite de partidas recientes (decisión técnica):** el historial en memoria del backend crece con cada cuestionario y no está paginado, por lo que el panel muestra como máximo las 10 partidas más recientes (constante `MAXIMO_PARTIDAS_RECIENTES` en `PanelHistorial.jsx`).
  - **Diseño de temáticas e historial:** estas dos pantallas siguen el diseño "Cognitive Clarity". Sus colores y fuentes se definen como variables CSS en `src/vistaDiseno.css`, con ámbito en la clase `.vista-diseno` (no en `:root`), de modo que el resto de la aplicación conserva su estilo. Los estilos propios están en `components/PanelHistorial.css` y `components/AccesoHistorial.css` (mobile first).
  - **Tipografía:** Hanken Grotesk y Space Grotesk se sirven desde el propio proyecto con las dependencias `@fontsource/hanken-grotesk` y `@fontsource/space-grotesk` (importadas en `src/main.jsx`), sin peticiones a servicios externos.
  - **Organización de estilos CSS (decisión técnica):** los estilos del frontend están modularizados por componente. Cada componente cuenta con su propio archivo CSS con el mismo nombre en `PascalCase` importado directamente desde su `.jsx` (ej. `Encabezado.css`, `SeleccionTematica.css`, `TarjetaTematica.css`, `PantallaPregunta.css`, `ProgresoCuestionario.css`, `TarjetaPregunta.css`, `OpcionRespuesta.css`, `ControlesPregunta.css`, `ResumenCuestionario.css` y `DetallePregunta.css`), incluyendo dentro de cada archivo sus respectivas reglas de media queries (`@media`). El archivo `src/index.css` se reserva únicamente para el reset CSS, las variables globales de color en `:root` (`--color-primario`, `--color-foco`, `--color-fondo`, `--color-superficie`, `--color-texto-base`, `--color-texto-medio`, `--color-texto-tenue`, `--color-linea` y `--color-linea-suave`, que usan los CSS de los componentes en lugar de repetir los valores), los estilos base del documento y los estilos de botones reutilizables compartidos (`.boton-principal` y `.boton-secundario`), mientras que `src/vistaDiseno.css` define las variables de color y tipografía del diseño "Cognitive Clarity" con ámbito en la clase `.vista-diseno`.
  - **Utilidades de formato:** `src/utils.js` reúne las funciones de formato compartidas. `formatearNota` muestra la nota con formato `es-ES` (coma decimal y como máximo un decimal) y la usan tanto `ResumenCuestionario` como `PanelHistorial`, para que una misma partida se vea igual en el resumen y en el historial. `formatearFecha` hace lo propio para la visualización de fechas en el historial. `obtenerClaseNota` devuelve la clase de color de una nota (`nota-alta` desde 8, `nota-media` desde 5 y `nota-baja` por debajo), compartida por las partidas del historial y las barras de `EstadisticasCategorias`.
- `scripts/`: scripts auxiliares del proyecto.
  - **Arranque único (`scripts/iniciar.js`, `npm start` en la raíz):** script de Node sin dependencias externas, para que funcione en un clon recién hecho antes de instalar nada. Ejecuta `npm install` en la raíz, `backend/` y `frontend/`, y lanza `npm run dev` en las dos aplicaciones. Al pulsar `Ctrl+C`, o si uno de los dos servidores termina, detiene ambos: en Windows mata el árbol de procesos con `taskkill /T` y en macOS/Linux lanza cada servidor en su propio grupo de procesos, para no dejar servidores huérfanos ocupando los puertos.
- `.gitlab/`: configuración y plantillas utilizadas por GitLab.
- `.husky/`: hooks de Git para automatizar comprobaciones del flujo de trabajo.
- `CONTRIBUTING.md`: convenciones de nomenclatura, calidad y contribución.

El frontend y el backend se ejecutan como procesos independientes durante el desarrollo. La comunicación entre ambos se ampliará mediante endpoints de la API y la configuración correspondiente de Vite a medida que avance el proyecto.

### Historial de Cuestionarios
El backend mantiene un registro en memoria de los cuestionarios completados.
- **Almacenamiento:** Array en memoria en el servidor. El historial es volátil (se pierde al reiniciar el servidor) y compartido por todos los clientes, por lo que las estadísticas mostradas agregan las partidas de todos los usuarios.
- **Alimentación:** El endpoint `POST /api/corregir` añade automáticamente una entrada al historial cada vez que se corrige un cuestionario con éxito.
- **Consultas:** El endpoint `GET /api/historial` devuelve la lista completa de cuestionarios realizados (en orden cronológico ascendente) junto con las estadísticas calculadas por categoría (`totalTests` y `notaMedia`). Con el historial vacío, devuelve arrays vacíos (`historial: []` y `estadisticas: []`).
- **Modelo de datos de una entrada del historial:**
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
- **Respuesta de `GET /api/historial`:**
```json
{
  "historial": [
    {
      "id": "hist-1",
      "fecha": "2026-10-16T10:30:00.000Z",
      "tematicaId": "cat-filosofia",
      "tematicaNombre": "Filosofía",
      "aciertos": 4,
      "total": 5,
      "nota": 8
    }
  ],
  "estadisticas": [
    {
      "tematicaId": "cat-filosofia",
      "tematicaNombre": "Filosofía",
      "totalTests": 3,
      "notaMedia": 7.3
    }
  ]
}
```

## Flujo de contribución

Las ramas, commits y merge requests deben seguir las reglas definidas en `CONTRIBUTING.md`. Todo cambio debe revisarse mediante una merge request antes de incorporarse a `main`.