# Cambio puntual a flores amarillas — proyecto Rosas

Repositorio: <https://github.com/Elaias99/Rosas>

## Objetivo

Modifica el proyecto para que las **flores y rosas de la experiencia sean amarillas reales**, mediante nuevos recursos gráficos. Conserva intacta la identidad visual y todo el comportamiento actual del sitio.

Este encargo **no es un rediseño ni un “tema amarillo”**. El único cambio perceptible debe estar en los pétalos de las ilustraciones florales.

## Resultado esperado

- La portada debe mostrar el mismo tipo de ramo, con la misma composición, escala, encuadre y estilo fotográfico/ilustrado, pero con flores y rosas amarillas.
- Al abrir el detalle, las flores que nacen y llenan la pantalla también deben usar versiones amarillas coherentes con el ramo.
- Las flores decorativas del mensaje y de las esquinas deben mantener esa misma familia visual.
- El follaje debe seguir verde; el papel kraft, el lazo, las sombras y los demás materiales deben conservar sus colores naturales actuales.
- La nueva versión debe sentirse como el mismo regalo original, no como otro diseño.

## Implementación requerida

1. Inspecciona primero el código y los recursos actuales del repositorio.
2. Crea recursos nuevos dentro de `public/flowers/`, preferentemente:
   - `bouquet-yellow.webp`
   - `rose-yellow.webp`
   - `ivory-posy-yellow.webp`
3. Usa imágenes con fondo transparente. Cada recurso nuevo debe conservar, respecto al original correspondiente:
   - las dimensiones exactas del lienzo;
   - la posición, escala y recorte del objeto;
   - una silueta y densidad visual equivalentes;
   - transparencia limpia, sin halos ni fondo incorporado;
   - calidad y peso apropiados para web.
4. Conserva los recursos originales sin sobrescribirlos, para permitir una reversión sencilla.
5. Actualiza únicamente las referencias necesarias para utilizar los nuevos recursos. Revisa especialmente:
   - `src/components/Bouquet.astro`
   - `src/components/FlowerField.astro`
   - `src/components/FloralExperience.astro`
   - `src/scripts/floral-gift.ts`
6. En `floral-gift.ts`, actualiza tanto las imágenes generadas dinámicamente como su precarga. No alteres ninguna otra lógica.

## Restricciones estrictas

- **No** uses `filter`, `hue-rotate`, `sepia`, overlays, modos de mezcla ni tintes CSS para simular el amarillo.
- **No** cambies variables de color, fondos, textos, botones, reproductor, tarjetas, sombras, tipografías ni paleta general.
- **No** agregues un tema amarillo global, lógica por fecha ni selector de temas.
- **No** cambies textos, rutas, audio, playlist, metadatos ni contenido.
- **No** cambies estructura HTML, tamaños, posiciones, breakpoints ni comportamiento responsive.
- **No** cambies estados, eventos, tiempos, keyframes, transiciones ni secuencia de la animación.
- **No** elimines ni reduzcas soporte de teclado, atributos ARIA, `inert`, `prefers-reduced-motion` o el fallback sin JavaScript.
- **No** hagas refactors, limpiezas o mejoras ajenas a este cambio.

## Criterios de aceptación

- En `/`, el ramo ocupa el mismo lugar y conserva aproximadamente la misma silueta y dimensiones que el actual.
- Al pulsar **“Abrir mi detalle”**, se mantiene exactamente el flujo actual: ramo → florecimiento → mensaje.
- El campo floral animado y el fallback de `/florecimiento/` usan flores amarillas reales, no imágenes teñidas por CSS.
- Los controles, el fondo crema y los acentos rosados originales permanecen sin cambios.
- No hay saltos de layout, imágenes deformadas, bordes rectangulares ni halos sobre el fondo.
- La experiencia funciona igual en móvil y escritorio, con y sin JavaScript y con movimiento reducido.
- `npm run build` termina correctamente.
- Una búsqueda en el código no encuentra filtros o reglas globales añadidas para colorear las flores.

## Validación antes de terminar

1. Ejecuta la compilación del proyecto.
2. Revisa visualmente la portada, el florecimiento y el mensaje final en vista móvil y de escritorio.
3. Comprueba que reproducir, cambiar canción, saltar al mensaje, volver al ramo y volver a florecer siguen funcionando.
4. Entrega un resumen corto con:
   - recursos creados;
   - archivos de código modificados;
   - validaciones ejecutadas;
   - cualquier limitación real encontrada.

## Definición breve de terminado

Si se compara el antes y el después, **solo las flores deben haber pasado a ser amarillas**. Todo lo demás debe verse y comportarse igual.
