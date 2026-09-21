# Flores para sacarte una sonrisa

Un detalle floral estático, hecho con Astro y TypeScript. El ramo abre una animación de abundancia floral y después revela un mensaje que se puede volver a ver.

## Desarrollo

Node >=22.12.0.

```sh
npm install
npm run dev -- --background
npm run astro -- dev status
npm run astro -- dev stop
```

En este equipo, si npm falla buscando npm-cli.js en AppData/Roaming, ejecutar primero en PowerShell:

```powershell
$env:npm_config_prefix='C:\Program Files\nodejs'
```

## Publicar

```sh
npm run build
```

Subir el **contenido de dist/** a la raíz de un alojamiento estático. Las rutas `/` y `/florecimiento/` funcionan sin backend. No publicar el servidor de desarrollo. El proyecto usa rutas absolutas: para publicarlo bajo una subcarpeta hace falta configurar y aplicar `base` a los recursos y enlaces.

## Editar el detalle

- `src/components/FloralExperience.astro`: textos, composición y estilos adaptables.
- `src/scripts/floral-gift.ts`: animación, tiempos, enfoque de teclado y repetición.
- `src/components/Bouquet.astro`: ramo de portada.
- `src/components/FlowerField.astro`: jardín estático de respaldo.
- `src/layouts/Layout.astro`: colores y fuentes locales.
- `public/flowers/`: ilustraciones WebP optimizadas, con transparencia real.

La expansión dura unos tres segundos; la abundancia permanece hasta revelar el mensaje a los 5,9 segundos. Se puede saltar con «Ver mensaje». Si el dispositivo solicita movimiento reducido, el mensaje aparece directamente. Sin JavaScript, el enlace lleva a una versión estática del detalle.

Fuentes Caveat y Nunito servidas localmente; no se requiere Google Fonts al abrir ni compilar. Ilustraciones generadas para este proyecto con la herramienta integrada de imágenes; indicaciones guardadas en `ASSETS.md`.
