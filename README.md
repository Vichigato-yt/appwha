# 📸 AppWha - Galería de Fotos con Swipe

Una aplicación móvil construida con React Native y Expo que permite capturar fotos con la cámara, visualizarlas en una galería interactiva con gestos tipo Tinder (swipe), y guardarlas en el dispositivo.

## 🎯 ¿Qué hace la aplicación?

**AppWha** es una aplicación de galería fotográfica con una interfaz intuitiva que permite:

- **📷 Captura de Fotos**: Toma fotos directamente desde la cámara del dispositivo
- **👆 Gestos Interactivos**: Desliza las fotos a la izquierda (descartar) o a la derecha (guardar)
- **💾 Guardado Automático**: Las fotos que te gustan se guardan automáticamente en la galería del dispositivo
- **🖼️ Dos Modos de Vista**:
  - **Modo Swipe**: Visualiza una foto a la vez con gestos de deslizamiento
  - **Modo Grid**: Ve todas tus fotos en una cuadrícula organizada
- **💿 Persistencia**: Todas las fotos capturadas se guardan localmente y persisten al cerrar la app

### Flujo de Uso
1. Abre la app y accede a la galería (pantalla principal)
2. Presiona el botón de cámara para capturar una nueva foto
3. La foto aparece en la galería en modo swipe
4. Desliza a la **derecha** para guardar en tu dispositivo o a la **izquierda** para descartar
5. Alterna entre vista swipe y grid para navegar tus fotos
6. Las fotos guardadas permanecen disponibles incluso después de cerrar la app

## 📦 Instalación

### Prerrequisitos

Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`
- Para Android: [Android Studio](https://developer.android.com/studio) o la app [Expo Go](https://expo.dev/client)
- Para iOS: [Xcode](https://developer.apple.com/xcode/) (solo en macOS) o la app [Expo Go](https://expo.dev/client)

### Instalación del Proyecto

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/Vichigato-yt/appwha.git
   cd appwha
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Ejecuta en tu dispositivo**
   
   **Para Android:**
   ```bash
   npm run android
   ```
   
   **Para iOS (solo macOS):**
   ```bash
   npm run ios
   ```
   
   **Para Web:**
   ```bash
   npm run web
   ```

   **O escanea el código QR** con la app Expo Go desde tu dispositivo móvil.

### Dependencias Principales

```json
{
  "expo": "~54.0.30",
  "expo-camera": "^17.0.10",
  "expo-media-library": "^18.2.1",
  "expo-image-picker": "~17.0.10",
  "expo-router": "~6.0.21",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-reanimated": "~4.1.1",
  "@react-native-async-storage/async-storage": "^2.2.0"
}
```

## 🏗️ Arquitectura del Proyecto

La aplicación sigue una arquitectura modular basada en **Atomic Design** y **Custom Hooks**, separando claramente la lógica de negocio de la presentación.

### Estructura de Carpetas

```
appwha/
├── app/                          # Pantallas principales (Expo Router)
│   ├── _layout.tsx              # Layout raíz con navegación
│   ├── index.tsx                # Redirección a galería
│   ├── gallery.tsx              # Pantalla de galería con swipe/grid
│   └── camera.tsx               # Pantalla de captura de fotos
│
├── components/                   # Componentes UI (Atomic Design)
│   ├── atoms/                   # Componentes básicos reutilizables
│   │   ├── Header.tsx           # Encabezado con título y subtítulo
│   │   ├── IconButton.tsx       # Botón con icono (Ionicons)
│   │   └── PrimaryButton.tsx    # Botón principal estilizado
│   │
│   ├── molecules/               # Componentes compuestos
│   │   ├── ActionBar.tsx        # Barra de acciones con botones
│   │   ├── PermissionBlocker.tsx # Pantalla de solicitud de permisos
│   │   └── SwipeCard.tsx        # Tarjeta con gestos de swipe
│   │
│   └── organisms/               # Componentes complejos
│       └── GalleryGrid.tsx      # Grid de fotos en formato cuadrícula
│
├── lib/                          # Lógica de negocio
│   ├── hooks/
│   │   └── useInitializeStore.ts # Inicialización del store al abrir app
│   │
│   ├── modules/                 # Lógica por funcionalidad
│   │   ├── camera/
│   │   │   └── useCameraLogic.ts # Lógica de cámara y permisos
│   │   ├── gallery/
│   │   │   └── useSaveToGallery.ts # Guardar fotos en dispositivo
│   │   └── ui/
│   │       └── useSwipeLogic.ts # Lógica de gestos de swipe
│   │
│   └── store/                   # Estado global
│       └── galleryStore.ts      # Store con listeners y persistencia
│
├── constants/                    # Configuraciones estáticas
│   ├── cards.ts                 # Datos de ejemplo (no usado)
│   └── theme.ts                 # Colores y estilos globales
│
├── types/                        # Definiciones TypeScript
│   └── card.ts                  # Interfaces y tipos
│
└── assets/                       # Recursos estáticos
    └── images/
        ├── iconoapp.jpg         # Icono de la aplicación
        └── GIF.gif              # Demostración de la app
```

### Patrones y Principios

#### 1. **Atomic Design**
Los componentes UI están organizados en tres niveles:
- **Atoms**: Componentes simples e indivisibles (`IconButton`, `Header`)
- **Molecules**: Combinación de atoms (`SwipeCard`, `ActionBar`)
- **Organisms**: Componentes complejos (`GalleryGrid`)

#### 2. **Custom Hooks para Lógica**
Toda la lógica de negocio está encapsulada en hooks reutilizables:
- `useCameraLogic`: Maneja permisos y captura de fotos
- `useSaveToGallery`: Guarda fotos en la galería del dispositivo
- `useSwipeLogic`: Controla los gestos de deslizamiento
- `useInitializeStore`: Carga fotos guardadas al iniciar

#### 3. **Estado Global con Listeners**
El store (`galleryStore.ts`) implementa un patrón de **listeners globales**:
- Sin necesidad de Redux o Context API
- Notificaciones reactivas a todos los componentes suscritos
- Persistencia automática en AsyncStorage
- Código simple y fácil de mantener

```typescript
// Ejemplo simplificado del patrón
let globalPhotos: Photo[] = [];
const listeners: Set<() => void> = new Set();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const addPhoto = (uri: string) => {
  globalPhotos.push({ id, uri, timestamp });
  notifyListeners(); // Actualiza todos los componentes
  savePhotosToStorage(globalPhotos); // Persiste cambios
};
```

#### 4. **Separación de Responsabilidades**
- **Pantallas** (`app/`): Solo coordinan componentes y hooks
- **Componentes** (`components/`): Solo UI y presentación
- **Lógica** (`lib/`): Business logic, side effects, y estado
- **Constantes** (`constants/`): Configuración centralizada

#### 5. **File-Based Routing (Expo Router)**
Navegación basada en la estructura de archivos:
- `index.tsx` → `/` (redirige a `/gallery`)
- `gallery.tsx` → `/gallery`
- `camera.tsx` → `/camera`

### Flujo de Datos

```
Usuario interactúa
       ↓
Componente de pantalla (gallery.tsx)
       ↓
Custom Hook (useCameraLogic, useSwipeLogic)
       ↓
Store Global (galleryStore.ts)
       ↓
notifyListeners() → Actualiza todos los componentes suscritos
       ↓
AsyncStorage (persistencia local)
```

### Tecnologías Clave

- **React Native**: Framework para apps móviles nativas
- **Expo**: Plataforma para desarrollo rápido
- **TypeScript**: Tipado estático para mayor seguridad
- **Expo Camera**: API de cámara nativa
- **Expo Media Library**: Guardar fotos en galería
- **React Native Gesture Handler**: Gestos táctiles
- **React Native Reanimated**: Animaciones fluidas
- **AsyncStorage**: Persistencia de datos local

## 📱 Demo

![Demo de la aplicación](assets/images/GIF.gif)
