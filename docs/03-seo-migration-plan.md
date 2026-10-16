# Protección SEO durante el rediseño

Estado: requisito vinculante del proyecto y plan de validación; no es una auditoría SEO final ni una afirmación de resultados de tráfico.

## Principio de migración

Conservar lo conseguido y mejorar sobre esa base. El presupuesto editorial aproximado del 30% no autoriza a retirar información que responde a búsquedas, servicios, ubicaciones ni páginas existentes. El diseño se adapta a las necesidades SEO del contenido.

Conservar inicialmente dominio, host canónico HTTPS con www, rutas y convención de barra final actuales. No combinar el rediseño con cambio de dominio ni reorganización de slugs. No se necesitan redirecciones para páginas cuya URL se mantiene.

## Evidencia que se debe preservar

- Inventario técnico: `evidence/site-inventory.json`.
- Copia local del HTML, robots y sitemaps publicados: `evidence/source-baseline/`. Es una referencia de contenido y señales públicas; no sustituye un respaldo de la infraestructura.
- Matriz de migración: `evidence/url-migration-map.csv`. Las 31 páginas descubiertas se mantienen con destino idéntico y respuesta esperada 200. El estado describe una decisión de planificación, no una verificación del sitio nuevo.
- Antes de publicar, contrastar el inventario con Search Console, analítica, backlinks y logs disponibles para detectar URLs históricas/huérfanas. Registrar cualquier falta de acceso como limitación. No presentar el rastreo público como lista completa de URLs con tráfico.
- Obtener línea base por página y consulta: clics, impresiones, CTR y posición de Search Console, y sesiones/conversiones orgánicas de analítica si están disponibles. Usar ventanas comparables y contexto estacional. Aún no se dispone de estos datos.

## Reglas de contenido y arquitectura

- Mantener intención de búsqueda y cobertura útil por página. No sustituir textos informativos por bloques visuales vacíos o texto solo en imágenes.
- Conservar inicialmente títulos, H1 y descripciones como referencia. Proponer mejoras concretas justificadas; evitar cambios masivos sin analizar datos. Las metas y encabezados pueden mejorarse, no se congelan indefinidamente.
- Mantener enlaces HTML rastreables a las páginas existentes desde navegación, pie y contenido pertinente. Revisar profundidad y relevancia de enlaces antes/después; una navegación visualmente agrupada no debe dejar páginas huérfanas.
- Inventariar datos estructurados, referencias empresariales, imágenes y documentos enlazados; mantener su significado correcto y rutas cuando sea posible. Si cambia un recurso con enlaces o tráfico, mapear también su destino equivalente.
- Mantener medición, conversiones y verificación de Search Console. No eliminar etiquetas o archivos de verificación al reconstruir el sitio.

## Sitemap y rastreo

- Mantener accesibles los endpoints actuales: `/sitemap-index.xml`, `/sitemap-0.xml` y el acceso existente desde `/sitemap.xml`.
- Conservar la cobertura de URLs canónicas indexables. El XML puede regenerarse; no es necesario conservarlo byte a byte ni mantener fechas falsas.
- Incluir solo destinos canónicos con respuesta 200 e intención de indexación. Si se aprueba una 301, el sitemap nuevo contendrá el destino final, no la URL redirigida.
- Conservar la declaración correcta del sitemap en robots.txt. Verificar que producción no herede bloqueos, `noindex` o canonical de las vistas previas.
- Evitar indexación de las vistas previas mediante controles apropiados al entorno; robots.txt por sí solo no garantiza exclusión del índice. Probar los controles también desde fuera de la sesión administrativa.

## Excepción: cambio de URL

1. Documentar motivo, URL de origen y equivalente exacto antes de cambiarla.
2. Implementar 301 permanente del lado del servidor hacia el destino final, sin cadenas, bucles ni redirecciones genéricas a la portada.
3. Actualizar enlaces internos, canonical, sitemap y recursos asociados.
4. Comprobar origen 301 y destino 200 con contenido equivalente; conservar parámetros que tengan función real.
5. Mantener redirecciones al menos un año y preferiblemente de forma indefinida mientras existan enlaces o visitas a las URLs antiguas.

No hay cambios de URL propuestos ni redirecciones configuradas actualmente.

## Condiciones obligatorias antes de publicar

- Todas las URLs de la matriz conservadas devuelven 200; las excepciones aprobadas cumplen 301 → 200.
- No hay 404/5xx nuevos en rutas o recursos migrados, páginas vacías con 200, bucles ni cadenas de redirecciones.
- Las páginas indexables tienen canonical de producción correcto y no tienen `noindex` ni bloqueos accidentales en robots/cabeceras.
- Sitemap, enlaces internos y canonicals concuerdan con la matriz.
- Comparación del contenido y señales por URL contra la referencia; diferencias justificadas y páginas prioritarias contrastadas con datos cuando estén disponibles.
- Contenido y enlaces esenciales renderizados en HTML accesible al rastreo.
- Datos estructurados pertinentes y coherentes con el contenido visible; no copiar marcado inválido por fidelidad al sitio anterior.
- Comprobaciones de rendimiento, accesibilidad, formularios, medición y conversiones, sin afirmar que una puntuación garantiza posiciones.
- Preparar versión recuperable del sitio/configuración y procedimiento de reversión antes del cambio de producción, evitando afectar correo o DNS ajenos al sitio.

## Publicación y seguimiento

Publicar solo con autorización expresa por el flujo GitHub–Cloudflare. Verificar las rutas en producción tras el despliegue; el éxito del build no confirma la migración.

Plan de revisiones tras la publicación: inmediata, 24–48 horas y comparaciones semanales durante las primeras 4–8 semanas, adaptadas a volumen de datos. No se ha creado una automatización; acordar su ejecución en la etapa de publicación.

Revisar cobertura/indexación, errores, sitemap, páginas y consultas, clics e impresiones, conversiones y rendimiento. Investigar caídas por URL e intención frente a periodos comparables y estacionalidad; ante fallos técnicos corregir o revertir según impacto. No prometer ausencia absoluta de fluctuaciones de ranking.

## Referencias oficiales consultadas

- Google Search Central, migraciones y cambios de URL: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- Google Search Central, creación y envío de sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
