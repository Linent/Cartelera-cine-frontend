# CARTELERACINE

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.
cosas que mejoraria algunos detalles en los filtros pero lo hice con mucho esmero y atención al detalle un poco raro eso pero así fue

## Development server

To start a local development server, run:

```bash
ng serve
```
# 🧩 Pokédex Dashboard – Frontend

Aplicación web interactiva tipo **Pokédex**, desarrollada como prueba técnica, que permite explorar, buscar, filtrar y ordenar Pokémon utilizando la **PokeAPI**, con una experiencia optimizada tanto para escritorio como para dispositivos móviles.

---

## ✨ Características principales

- 🔍 **Búsqueda por nombre** de Pokémon
- 🧬 **Filtrado por tipo** (Normal, Fire, Water, etc.)
- 💪 **Ranking de Pokémon más fuertes**, ordenados por estadísticas base
- ➕ **Carga progresiva (Load More)** en bloques de 30 Pokémon
- 📱 **Diseño responsive**, con dropdown → modal en móviles
- ⏳ Estados de carga claros y accesibles
- 🚫 Bloqueo inteligente de filtros durante cargas pesadas
- 🎨 UI moderna con **Tailwind CSS**
- 🐛 *Easter egg* visual para Pokémon sin sprite disponible

---

## 🛠️ Tecnologías utilizadas

### Frontend
- **Angular** (standalone components)
- **TypeScript**
- **RxJS**
- **Tailwind CSS**
- **HTML5 / CSS3**

### Backend (API)
- **PokeAPI**
  - https://pokeapi.co/api/v2/pokemon
  - https://pokeapi.co/api/v2/type

> ⚠️ Nota: No se desarrolló un backend propio para esta prueba.  
> Toda la información se consume directamente desde la PokeAPI.

---

## 📁 Arquitectura del proyecto (Frontend)

Se utilizó una arquitectura **modular y escalable**, separando responsabilidades:
```bash
src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── login.component.ts
│   │   ├── auth-guard.ts
│   │   ├── auth-interceptor.ts
│   │   ├── auth.service.ts
│   │   ├── auth.ts
│   │   └── public.guard.ts
│   │
│   ├── dashboard/
│   │   ├── dashboard-home/
│   │   │   ├── dashboard-home.html
│   │   │   └── dashboard-home.ts
│   │   │
│   │   ├── models/
│   │   │   ├── pokemon.model.ts
│   │   │   ├── pokemon-filters.model.ts
│   │   │   └── user.model.ts
│   │   │
│   │   ├── navbar-dashboard/
│   │   │   └── navbar-dashboard.component.ts
│   │   │
│   │   ├── pokemon-card/
│   │   │   └── pokemon-card.component.ts
│   │   │
│   │   ├── pokemon-filters/
│   │   │   ├── pokemon-filters.component.ts
│   │   │   └── pokemon-filters.component.html
│   │   │
│   │   ├── profile/
│   │   │   ├── profile.component.ts
│   │   │   ├── profile.component.html
│   │   │   └── profile.service.ts
│   │   │
│   │   ├── types/
│   │   │   └── typesPokemon.ts
│   │   │
│   │   ├── dashboard.component.html
│   │   ├── dashboard.component.ts
│   │   └── pokemon.service.ts
│   │
│   ├── home/
│   │   └── home.component.ts
│   │
│   ├── shared/
│   │   ├── navbar/
│   │   │   └── navbar.component.ts
│   │   │
│   │   └── ui/
│   │       ├── dropdown/
│   │       │   ├── dropdown.component.ts
│   │       │   ├── dropdown.component.html
│   │       │   ├── dropdown-option.model.ts
│   │       │   └── dropdown-modal/
│   │       │       ├── dropdown-modal.component.ts
│   │       │       ├── dropdown-modal.component.html
│   │       │       └── dropdown-modal.css
│   │
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.component.ts
│   └── app.html
│
├── environments/
│   └── environment.ts
```

### Principios aplicados
- Separación de responsabilidades (UI / lógica / datos)
- Componentes reutilizables
- Comunicación clara mediante `@Input()` y `@Output()`
- Manejo explícito de estados (`loading`, `loadingStrongest`, `mode`)
- Evitar renderizados innecesarios

---

## 🧠 Modos de visualización (View Modes)

La aplicación maneja distintos modos de vista:

- `all` → Pokédex general (paginada)
- `search` → Búsqueda puntual por nombre
- `type` → Pokémon por tipo específico
- `strongest` → Ranking global por poder

Esto permite:
- Controlar correctamente la UI
- Mostrar/ocultar botones como **“Cargar más”**
- Aplicar reglas claras de interacción

---

## 💪 Ranking “Más fuertes”

La opción **“Más fuertes”**:

1. Consume todos los Pokémon desde:

https://pokeapi.co/api/v2/pokemon?limit=2000

2. Obtiene el detalle individual de cada Pokémon
3. Calcula su **poder total** sumando sus `base_stat`
4. Ordena de mayor a menor
5. Renderiza progresivamente (30 en 30)

Durante este proceso:
- Se muestra un **loader especial**
- Se bloquean los filtros para evitar múltiples peticiones
- Se mejora la experiencia del usuario en cargas pesadas

---

## 🎨 Diseño y UX

- **Tailwind CSS** para estilos rápidos, consistentes y escalables
- Componentes adaptativos:
- Dropdown en desktop
- Modal fullscreen en mobile
- Animaciones sutiles para loaders y transiciones
- Estados visuales claros (disabled, loading, empty)

---

## 🐛 Easter Egg: Pokémon glitcheado

Algunos Pokémon en la PokeAPI **no tienen sprite disponible** (`sprites = null`).

En lugar de mostrar una imagen rota o un placeholder genérico, se decidió usar como imagen por defecto un **Pokémon glitcheado**, inspirado en los famosos glitches de las primeras generaciones (como *MissingNo.*).

📌 Contexto:
- En Pokémon Red & Blue (1996), ciertos errores de memoria generaban Pokémon corruptos
- Hoy en día son parte de la cultura y nostalgia de la franquicia
- Este detalle añade personalidad y guiño a los fans

---

### 👤 Perfil de Usuario

La aplicación incluye una sección de perfil que simula un sistema real de usuario autenticado, permitiendo gestionar información personal y preferencias.

### 📌 Funcionalidades del Perfil
### 🎬 Preferencias de Géneros de Películas

El usuario puede seleccionar sus géneros de películas favoritos, los cuales se utilizan como:

Ejemplo de preferencias persistentes del usuario

Demostración de consumo de API protegida con autenticación

Ejercicio de manejo de estado y UX interactiva

#### Características:

Selección múltiple de géneros

Indicador visual de géneros activos

Contador dinámico de géneros seleccionados

Botón de guardado con feedback visual (toast)

### Ubicación:
```bash
app/dashboard/profile/
├── profile.component.ts
├── profile.component.html
├── profile.service.ts
├── models/
│   ├── genre.model.ts
│   └── user-profile.model.ts

```
### 🔐 Cambio de Contraseña

El perfil incluye un flujo completo de cambio de contraseña mediante un modal accesible desde la sección de seguridad.

#### UX del Modal:

Apertura mediante botón “Cambiar contraseña”

Cierre al:

Presionar “Cancelar”

Hacer clic fuera del modal

Presionar el botón de cerrar (✕)

Inputs con validación visual

Botones con estados hover y disabled

Feedback con toast de éxito o error
```bash
shared/ui/
├── password-modal/
│   ├── password-modal.component.ts
│   ├── password-modal.component.html
│   └── password-modal.component.css
```
### 🔐 Seguridad y Autenticación

El frontend está preparado para trabajar con un backend Laravel autenticado mediante JWT.

Elementos clave:

AuthInterceptor

Inyecta automáticamente el header:

Authorization: Bearer <TOKEN>


AuthGuard

Protege rutas privadas como /dashboard y /profile

PublicGuard

Evita que usuarios autenticados accedan al login

### 📁 Ubicación:

```bash
app/auth/
├── auth.service.ts
├── auth.interceptor.ts
├── auth-guard.ts
├── public.guard.ts
└── login/
```
### 🧠 Arquitectura de Estado del Perfil
```bash
ProfileComponent
  ↓
ProfileService
  ↓
API Protegida (Laravel)
```
### 🎨 UI & Experiencia de Usuario

La sección de perfil mantiene coherencia visual con el resto de la app:

Tailwind CSS

Animaciones suaves

Feedback inmediato (toasts)

Estados de carga y disabled

Diseño responsive




### 📁 Implementación:

## 🚀 Cómo ejecutar el proyecto localmente

### Requisitos
- Node.js >= 18
- npm o yarn
- Angular CLI >= 16

### Instalación

```bash
npm install
```

### Ejecutar en desarrollo
```bash
ng ser -o
```
Abri en navegador o se abrira automaticamente

```bash
localhost:4200
```

### 🧪 Consideraciones finales

El proyecto prioriza experiencia de usuario, claridad y robustez

Está preparado para escalar (por ejemplo, cachear rankings)

Se evitó complejidad innecesaria manteniendo buenas prácticas

La UI responde correctamente a estados extremos (cargas largas, errores, vacío)

### 👋 Autor

Desarrollado como prueba técnica por Anderson Eduardo Ochoa Peñaranda
Con enfoque en arquitectura limpia, UX y código mantenible. 
Espero les guste
