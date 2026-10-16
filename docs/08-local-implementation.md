# Homepage — Implementación local de la propuesta aprobada

## Estado

Primera fase de código terminada para revisión local: homepage Astro, no migración completa de las 31 páginas. Diseño desktop B aprobado, con Archivo Black, Amber, top bar y cobertura oscuros, y FAQ con imagen/espacio superior. Implementación fluidamente adaptable sin una nueva propuesta móvil en Pencil.

Vista: http://127.0.0.1:4321/. El servidor de preview se dejó disponible para revisión. Comando para reiniciar: `npm run preview -- --port 4321`. Para detener, Ctrl+C en su proceso/terminal. La edición usa `npm run dev`.

## Implementación

- Astro 7.4.0 estático, TypeScript estricto y CSS propio. Sin React, Tailwind, librería de animación ni hidratación de frameworks.
- `src/pages/index.astro`: homepage y contenido aprobado.
- `src/layouts/SiteLayout.astro`: metadatos y estructura compartida.
- `src/components/SiteHeader.astro`: logo y navegación, desplegable nativo de servicios, menú compacto y Escape/foco.
- `src/components/SiteFooter.astro` y `src/data/site.ts`: directorios de servicios y destinos actuales.
- `src/styles/global.css`: tokens, tipografía, componentes y reflow.
- Fontsource: Archivo Black latino 400 y Open Sans latino 400/600 alojados localmente, licencias en `public/licenses/`.
- Imágenes originales procesadas con Astro a AVIF/WebP y fallback, anchos adaptativos y dimensiones explícitas. Foto de hero con prioridad alta; contenido inferior lazy.
- 987 bytes de script inline compilado para navegación en esta versión. Sin solicitudes externas observadas durante la carga en el navegador de pruebas aislado.
- Hero estático. La idea de fondo animado se abordará en otra iteración de código tras definir el efecto; respetar movimiento reducido, texto visible y presupuesto de rendimiento.

Se contrastaron configuración e imágenes con documentación oficial actual de Astro antes de instalar. No se adoptaron automáticamente las integraciones de compresión/critical CSS o los imports remotos de fuentes sugeridos por la skill: la salida estática ya se comprime y las fuentes son locales. Medir antes de introducir otras dependencias.

## Protección del sitio existente

- Sin push, commit, conexión remota, despliegue ni cambios en DNS o producción. Git inicializado localmente en main, sin modificar identidad global.
- Solo existe `/` en el nuevo build. Los demás enlaces llevan a sus URLs públicas actuales para no presentar páginas vacías o rotas como migradas. El botón de contacto lleva al formulario existente.
- El contenido conserva H1, título, descripción y canonical del inicio; no implica indexación o equivalencia SEO ya comprobada.
- El HTML local usa `noindex, nofollow` de forma deliberada. No generar un sitemap incompleto ni publicar esta fase como reemplazo del sitio.
- Antes de publicar: migrar las 30 páginas restantes, resolver navegación/formularios y metadatos estructurados, contrastar Search Console/analítica, preservar verificación/medición, restaurar los sitemaps completos y retirar controles de preview después de aprobar el plan SEO.

## Comprobaciones realizadas

- `npm run check`: 0 errores, 0 advertencias, 0 hints.
- `npm run build`: correcto, una página, con variantes optimizadas de imágenes.
- `npm run test:ui`: 4 pruebas correctas en Chromium aislado.
- H1 único y exacto, título y canonical conservados; enlaces a todas las 30 rutas interiores del inventario presentes.
- Navegación de servicios por teclado, Tab y Escape; apertura/cierre del menú compacto.
- Sin desbordamiento horizontal a 320, 390, 768, 1024, 1280, 1440 y 1920 px.
- Axe A/AA automático: 0 infracciones y 0 comprobaciones incompletas. No equivale a certificación WCAG ni prueba con lector de pantalla.
- Sin errores de JavaScript capturados y sin peticiones de página a terceros durante la carga en Chromium aislado.
- Capturas reales revisadas: `evidence/local-review/desktop.png`, `hero-desktop.png` y `mobile-fallback.png`. Comparadas visualmente con la propuesta; no son prueba Safari/iPhone.
- Detector Impeccable ejecutado una vez: dos avisos de colores para hover y regla del pie; ambos son estados/detalles intencionados ya documentados en DESIGN.md. No hubo otros hallazgos.

La primera instalación dejó archivos incompletos; se repuso con `npm ci` antes de las verificaciones finales. El Chrome instalado emitía solicitudes inyectadas por extensiones del entorno; la evidencia final proviene del runtime Chromium limpio de Playwright, sin esas peticiones. No se modificaron extensiones ni configuración del navegador del usuario.

## Límites y siguiente fase

No se midieron Lighthouse, CrUX, tráfico ni posiciones. No se verificó entrega de formularios o llamadas reales ni se enviaron solicitudes comerciales. La portada local puede revisarse; la publicación continúa bloqueada por la migración y comprobaciones pendientes, no por el diseño aprobado.

Siguiente fase: trasladar contenido e implementar plantillas interiores conservando las URLs y el sitemap; cerrar formulario e integración, y medir el sitio completo antes de publicación autorizada vía GitHub–Cloudflare.
