# Homepage B — Desktop para revisión

## Estado y autoridad

DISEÑO APROBADO: el usuario dio por terminada la fase Pencil tras aprobar Archivo Black y las mejoras posteriores. Se autoriza continuar a código. Brand board B y homepage desktop con los refinamientos Amber, oscuros y FAQ son la referencia vigente. La opción A sigue archivada y rechazada. No se creó nueva propuesta móvil. Implementación local documentada en `08-local-implementation.md`.

Archivo Pencil: `../pencil-design/airturbulencia.pen`. Frame: `gcKwa`.

- Página completa: `../design/exports/home-b/homepage-desktop-b.png`.
- Hero: `../design/exports/home-b/hero-desktop-b.png`.
- Servicios: `../design/exports/home-b/services-desktop-b.png`.

## Contrato de dirección

Modo de esta página: persuadir, mediante información útil y contacto claro. Público y objetivos según PRODUCT.md. Autoridad visual: brand board B aprobado, no la propuesta A.

Paleta: papel cálido #FAFAF7, piedra #EEEFEA, tinta #182D38, azul petróleo #155E75. Ámbar #D97706 disponible solo para detalles; su ausencia en una sección no requiere añadirlo decorativamente. Poppins 500 para títulos y Open Sans 400/600 para cuerpo y controles. Logo publicado intacto sobre blanco. Bordes discretos de 4 px en botones; las fotografías no necesitan esquinas redondeadas.

Primer viewport: cabecera blanca y logo, H1 original grande sobre papel cálido, texto original en columna secundaria, solicitud de servicio y teléfono. Panorama luminoso de la web actual debajo del mensaje, sin texto sobre la foto. El contacto principal es visible antes de la imagen.

Composición de servicios: introducción y fotografía de detalle a la izquierda; servicios principales en filas horizontales a la derecha, con iconos de línea y separadores. Bloque de empresa y experiencia sobre tinta oscura. Después alternar imagen, lectura y evidencia con menor densidad. Sin carruseles, badges inventados ni animación representada como funcional.

## Secuencia de contenido

1. Información regional y teléfono; cabecera con logo y navegación.
2. Hero editorial con imagen panorámica y accesos directos a servicios principales.
3. Instalación, reparación y comercial con los textos actuales; enlaces a mantenimiento y urgencias.
4. Air Turbulencia / AC Installation Tampa y All Makes and Models, con contenido publicado conservado.
5. Evaluación e instalación de equipos y acceso a financiación, sin cuotas nuevas.
6. Heating Installation Tampa y Heating Repair Service, con textos actuales.
7. Testimonials: Joe Welbourn y Andrew Semryck, conservando citas y atribuciones.
8. Service Area con localidades existentes y acceso a cobertura completa.
9. FAQs complementarias, basadas en servicios descritos actualmente.
10. Cierre conservando el mensaje de instalación en Tampa y contacto.
11. Pie con directorio completo de servicios, recursos, empresa y páginas legales.

## SEO y contenido

H1 exacto conservado: “Trusted Specialists in AC Installation Tampa”. Título/meta, sitemap y rutas no cambian en este artefacto. Se mantienen los textos principales existentes y no se convierten en imágenes durante la implementación. Los textos nuevos de resumen/FAQs/instalación son propuestas editoriales sujetas a revisión.

El inventario de 31 páginas y la matriz de migración siguen vigentes. El pie representa enlaces a esos destinos; la matriz técnica final se verificará en el HTML construido. Pencil elimina las propiedades href/metadata al leer de vuelta estos nodos en la versión actual: las muestras visuales no son prueba de enlaces funcionales. Para implementación, usar `evidence/url-migration-map.csv` y `evidence/home-b-link-handoff.json`.

La navegación `Services` es un desplegable previsto, no una nueva ruta /services/. Conservar acceso HTML rastreable a todos los destinos y diseñar su estado abierto antes de implementar el comportamiento.

## Recursos y límites

Logo y cuatro imágenes proceden del sitio publicado. La foto de familia del hero es una imagen de ambientación, no un testimonio o cliente identificado. La imagen de instalación parece una representación de equipo residencial: no atribuirla a un trabajo real. La foto de reparación tampoco acredita por sí sola autoría de la empresa. Verificar derechos/calidad y originales antes de producción.

Las afirmaciones comerciales heredadas (experiencia, diagnóstico, estimación gratuita y otras) requieren confirmación de vigencia antes de publicar, sin inventar credenciales nuevas.

Se inspeccionaron capturas de hero, cabecera, servicios, empresa, instalación, testimonios, cobertura, cierre, pie y exportación completa. Esto no comprueba responsive, estados de interacción, formularios, WCAG, rendimiento ni SEO en producción. No se ejecuta detector HTML/CSS sobre un archivo .pen cifrado.

## Próxima decisión

### Prueba solicitada: títulos más robustos

El usuario solicitó probar una fuente más fuerte, próxima al carácter del logo, sobre todo en los títulos. Se aplicó Archivo Black a los encabezados del homepage mediante la variable independiente `b-heading-trial`, sin modificar la variable Poppins del brand board aprobado. Archivo Black usa peso 400 nominal porque sus glifos ya tienen un diseño de peso negro. Párrafos y controles conservan Open Sans. La cita de Joe Welbourn, que antes usaba la familia de títulos, pasa a Open Sans para mantener una lectura más ligera sin cambiar su texto.

Esta tipografía es una prueba para revisión, no una modificación aprobada de DESIGN.md o del brand board. Capturas revisadas: hero, servicios, empresa y FAQ. No se cambió el H1, texto útil, rutas ni estructura de secciones. Exportaciones descriptivas de página completa, hero y servicios actualizadas. Evidencia separada de la prueba: `../design/exports/home-b/archivo-trial/`.

### Ajuste solicitado: espacio superior e imagen en FAQ

FAQ (`TfgRf`) ahora tiene padding superior de 80 px; se mantienen 88 px laterales y 80 px inferiores. Se añadió en la columna izquierda una imagen de equipos de 380 × 240 px en modo contain, recuperada de `/images/goodman-ac-install-min.jpg` del sitio actual. Recurso local: `../design/assets/faq-equipment.jpg`. No atribuirlo a un trabajo ni una afiliación comercial nuevos. Se revisó la captura de la sección y se actualizó la exportación completa; texto de preguntas/respuestas conservado. Vista de detalle: `../design/exports/home-b/faq-desktop-b.png`.

### Prueba solicitada: top bar y cobertura oscuros

Aplicado fondo tinta B #182D38 en el top bar (`PFbW9`) y Service Area (`z6cpsp`). Textos principales y localidades blancos; texto secundario #D7E2E5. Enlace de cobertura blanco y subrayado. Se conservaron contenido, geometría y los acentos Amber existentes. Capturas de ambas secciones revisadas; exportación completa descriptiva actualizada. Variación para revisión, no nueva aprobación general ni cambio del hero. Evidencia: `../design/exports/home-b/dark-sections/`.

### Refinamiento solicitado: Amber

Se cambió a #D97706 el color de los tres iconos de servicios, el icono de equipos y los tres checks de instalación. Se agregaron reglas decorativas de 56 × 3 px en empresa y cierre. Botones y enlaces mantienen azul petróleo; no se añadió texto pequeño en ámbar. Contraste calculado de ámbar sobre papel 3.05:1 y sobre tinta 4.48:1, apropiado para estos gráficos, no una comprobación de conformidad del sitio.

Nueva captura completa: `../design/exports/home-b/amber/gcKwa.png`. La exportación con nombre descriptivo de esta página también está actualizada. Se revisaron visualmente las cuatro secciones afectadas. El hero no fue modificado: el usuario pidió una valoración de su composición, no un cambio de layout. Se considera adecuada para la dirección editorial B; su altura y jerarquía deben validarse en el viewport real de la implementación, sin afirmar una mejora de conversión no medida.

Revisión visual independiente realizada sobre la exportación completa, hero, servicios, brand board y contenido fuente: sin defectos visuales materiales que impidan entregar esta propuesta para revisión del usuario. Veredicto limitado a diseño estático desktop; no equivale a aprobación del usuario ni a validación técnica del sitio.

Revisar esta composición desktop. Resolver ajustes antes de extender el sistema a interiores, preparar móvil en una fase autorizada o empezar la implementación. No hay autorización de commit/push/publicación.
