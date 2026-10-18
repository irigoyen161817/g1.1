# Guía de Contribución y Nomenclatura del Proyecto (G1.1)

Este documento define los estándares de nomenclatura, calidad de código y flujo de trabajo en Git que todo el equipo debe seguir para mantener un código limpio (_Clean Code_) y un historial de versiones ordenado.

---

## 1. Nomenclatura de Ramas (Git Branches)

Todas las ramas de trabajo deben crearse a partir de la rama principal **`main`**. Queda prohibido hacer commits directamente sobre `main`.

### Formato obligatorio:

```text
<tipo>/<id-tarea>-<descripcion-corta>
```

### Reglas:

- **`<tipo>`**: Indica la naturaleza del trabajo:
  - `feat`: Nueva funcionalidad.
  - `fix`: Corrección de un error (_bug_).
  - `docs`: Cambios únicamente en la documentación.
  - `chore`: Tareas de configuración, herramientas o mantenimiento (ej. ESLint, Husky).
  - `refactor`: Reestructuración de código sin cambiar su comportamiento.
  - `test`: Añadir o corregir pruebas.
- **`<id-tarea>`**: Identificador de la tarea o issue correspondiente (ej. `T0.2`, `T1.1`).
- **`<descripcion-corta>`**: En español, todo en minúsculas, sin tildes ni letra `ñ`, separando las palabras con guiones medios (`kebab-case`).

### Ejemplos válidos:

- `feat/T0.2-instanciar-frontend`
- `chore/T0.5-configurar-eslint-husky`

### Ejemplos inválidos:

- `rama-juan` (No sigue el formato ni indica la tarea)
- `feat/instanciar_frontend` (Falta el ID de tarea y usa guion bajo)

---

## 2. Nomenclatura de Commits

El proyecto utiliza un formato estricto validado automáticamente por **Husky** vinculado a las Historias de Usuario (`HHUU`). Las tareas de configuración inicial del proyecto se engloban bajo **`HHUU00`**.

### Formato obligatorio:

```text
<ID-HHUU>: <mensaje en minúsculas>
```

### Reglas:

- **`<ID-HHUU>`**: Código de la Historia de Usuario en mayúsculas seguido de dos puntos y un espacio (ej. `HHUU00`, `HHUU01`, `HHUU02`...).
- **`<mensaje en minúsculas>`**: Descripción clara y concisa en **español y en minúsculas**, empezando preferiblemente con un verbo en infinitivo (añadir, corregir, configurar, crear...) y sin punto final.

### Ejemplos válidos:

- `HHUU00: iniciar repositorio y archivo gitignore`
- `HHUU01: crear endpoint de inicio de sesion`

### Ejemplos inválidos:

- `hhuu01: crear login` (El código HHUU debe ir en mayúsculas)
- `HHUU01: Crear login.` (El mensaje debe empezar en minúsculas y no llevar punto final)

---

## 3. Calidad, Nomenclatura y Comentarios del Código

- **Idioma general del código:** **Español** (variables, métodos, clases, componentes, rutas y comentarios). Evitar el uso de la letra `ñ` y tildes en identificadores de código (usar `anio` en lugar de `año`).
- **Herramienta de validación:** Todo el código debe pasar sin errores el análisis de **ESLint** antes de subir cambios.
- **Formato:** Todo el código debe cumplir **Prettier** (`npm run format:check`). Para aplicar el formato automáticamente se usa `npm run format`.

### 3.1. Convención de nombres (Variables, métodos y clases)

| Elemento                                   | Convención                                  | Ejemplo                                               |
| :----------------------------------------- | :------------------------------------------ | :---------------------------------------------------- |
| **Variables, funciones y métodos**         | `camelCase`                                 | `usuarioActual`, `obtenerListaProductos()`            |
| **Booleanos**                              | `camelCase` (prefijo `es`, `tiene`, `esta`) | `estaCargando`, `tienePermisos`                       |
| **Clases y Componentes de React (`.jsx`)** | `PascalCase`                                | `GestorUsuarios`, `FormularioLogin.jsx`               |
| **Archivos de estilos CSS por componente** | `PascalCase` (mismo nombre que componente)  | `Encabezado.css`, `SeleccionTematica.css`             |
| **Constantes globales y `.env`**           | `UPPER_SNAKE_CASE`                          | `PUERTO_SERVIDOR`, `MAX_INTENTOS_LOGIN`               |
| **Archivos JS en Backend y utilidades**    | `camelCase`                                 | `usuarioControlador.js`, `autenticacionMiddleware.js` |
| **Carpetas del proyecto**                  | `camelCase` (o minúsculas)                  | `controladores/`, `componentes/`                      |
| **Endpoints de la API (REST)**             | `kebab-case` (sustantivos en plural)        | `/api/usuarios`, `/api/pedidos-pendientes`            |

### 3.2. Estándar de comentarios en el código

- **Fragmentos no evidentes:** Cualquier bloque de lógica compleja, expresión regular o decisión técnica no evidente debe ir acompañado de un comentario en línea (`//`) que explique claramente **qué hace y por qué** se ha implementado de esa manera.
- **Código autoexplicativo:** Se deben evitar comentarios redundantes en líneas obvias y no se exige documentar clases, métodos o funciones mediante JSDoc. Se priorizan nombres de variables y métodos descriptivos.

---

## 4. Nomenclatura de Base de Datos

Todos los elementos de la base de datos se escribirán en español, en minúsculas, sin tildes ni letra `ñ`, utilizando la convención **`snake_case`**:

- **Tablas / Colecciones:** Sustantivos en plural en `snake_case` (ej. `usuarios`, `detalles_pedido`).
- **Columnas / Campos:** En `snake_case` descriptivo (ej. `nombre_completo`, `fecha_creacion`).
- **Claves Primarias (PK):** `id` (o `id_<tabla_singular>`, ej. `id_usuario`).
- **Claves Foráneas (FK):** `id_<tabla_referenciada_singular>` (ej. `id_usuario`, `id_pedido`).
- **Índices y Restricciones:** Prefijos `idx_` para índices y `fk_` para claves foráneas (ej. `idx_usuarios_email`, `fk_pedidos_usuario`).

---

## 5. Flujo de Trabajo y Revisión de Código (Merge Requests)

1. **Sincronizar:** Antes de empezar una tarea, situarse en `main` y descargar los últimos cambios (`git pull origin main`).
2. **Crear rama:** Crear una rama nueva siguiendo la nomenclatura del punto 1 (`git checkout -b <tipo>/<id-tarea>-<descripcion>`).
3. **Desarrollar y confirmar:** Realizar commits atómicos siguiendo la nomenclatura del punto 2 (`HHUUXX: <mensaje>`). Husky verificará automáticamente la rama, el mensaje del commit y las reglas de ESLint.
4. **Subir rama:** Subir la rama al repositorio remoto (`git push -u origin <nombre-rama>`).
5. **Revisión por pares y Merge Request (MR):**
   - Abrir un **Merge Request** en GitLab desde la rama de la tarea hacia **`main`**.
   - Asignar obligatoriamente a otro miembro del equipo como revisor (_Reviewer_).
   - **Visto bueno obligatorio:** Ningún cambio puede fusionarse en `main` sin que otro miembro del equipo haya revisado el código (comprobando nomenclatura, comentarios y funcionamiento) y haya otorgado su aprobación (_Approve_) en GitLab.
