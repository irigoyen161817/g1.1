# Proyecto EduQuest G1.1

Proyecto de desarrollo de la asignatura GPI1.

## Requisitos

- Node.js 20 o superior.
- npm.

## Instalación

El proyecto está dividido en dos aplicaciones independientes. Es necesario instalar las dependencias de cada una:

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

## Arquitectura base

El proyecto utiliza una arquitectura separada en dos aplicaciones:

- `backend/`: servidor HTTP desarrollado con Node.js y Express. El punto de entrada es `index.js` y expone endpoints de la API como `GET /api/tematicas`, `GET /api/preguntas` y `POST /api/corregir`.
- `frontend/`: aplicación cliente desarrollada con React y Vite. El código principal se encuentra en `src/`, con `App.jsx` como componente principal y `main.jsx` como punto de entrada. La selección de temáticas se gestiona desde `components/SeleccionTematica.jsx` y el cuestionario se coordina desde `components/PantallaPregunta.jsx`, acompañado de componentes independientes para el progreso, las opciones, la navegación y la pantalla final (`components/PantallaFinalCuestionario.jsx`).
  - **Flujo de corrección de cuestionarios:** al elegir una temática en `SeleccionTematica`, se propagan como props hacia `PantallaPregunta` el `tematicaId`, las `preguntas` y el callback `alSalir`. Tras responder a la última pregunta, el cliente envía una petición `POST /api/corregir` con el cuerpo `{ tematicaId, respuestas: [{ idPregunta, indiceRespuesta }] }`. Al recibir la respuesta del servidor, `PantallaPregunta` pasa las props `resultado` (con el resultado validado de la corrección), `totalPreguntas`, `preguntas` y `alSalir` a `PantallaFinalCuestionario`.
- `scripts/`: scripts auxiliares del proyecto.
- `.gitlab/`: configuración y plantillas utilizadas por GitLab.
- `.husky/`: hooks de Git para automatizar comprobaciones del flujo de trabajo.
- `CONTRIBUTING.md`: convenciones de nomenclatura, calidad y contribución.

El frontend y el backend se ejecutan como procesos independientes durante el desarrollo. La comunicación entre ambos se ampliará mediante endpoints de la API y la configuración correspondiente de Vite a medida que avance el proyecto.

## Flujo de contribución

Las ramas, commits y merge requests deben seguir las reglas definidas en `CONTRIBUTING.md`. Todo cambio debe revisarse mediante una merge request antes de incorporarse a `main`.
