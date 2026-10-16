# Air Turbulencia — Direcciones visuales

Estado vigente: el usuario rechazó la propuesta A y eligió empezar de cero con B. Secuencia solicitada: brand board primero, homepage solo desktop después. Las secciones A/C y la recomendación inicial se conservan como historial de alternativas, no como decisiones vigentes. Arquitectura y protección SEO se mantienen.

## Referencias y decisiones comunes

- Logo recuperado de la web pública y examinado: `../design/assets/logo-original.png`. Se conserva sin recolorear, redibujar ni recortar. La calidad disponible es la del archivo publicado; no se ha localizado un original vectorial.
- La marca combina azules/cian y amarillo/naranja; las propuestas toman esa relación cromática sin convertir todos los colores del logo en colores de interfaz.
- ui-ux-pro-max sugirió el patrón Trust & Authority + Conversion, azul con acento cálido y Poppins/Open Sans. Se aceptan como orientación la claridad, el contacto visible y la evidencia verificable; no se adoptan automáticamente carruseles, sellos ni afirmaciones comerciales.
- Primera entrega en inglés. Mantener rutas, temas e intención del contenido actual. Los ejemplos de copy aquí son exploratorios y no sustituyen los títulos/H1 existentes.
- Bases claras para lectura, fotos del trabajo verificadas, composición con espacio, tipografía legible y movimiento discreto. Sin vídeo de fondo ni carruseles automáticos.
- Fuentes de producción alojadas localmente en WOFF2, con pesos mínimos y fallback; no se usarán imports remotos de CSS. Elegir archivos y subconjuntos según licencia y diseño final.
- Los pares de color de texto y fondo deben cumplir contraste antes de aprobar componentes. Las muestras no constituyen una auditoría de accesibilidad.

## A — Fresh & Reliable (recomendada)

Sensación: fresca, clara y profesional; cercana a propietarios y negocios locales.

| Función | Color |
| --- | --- |
| Fondo principal | `#FFFFFF` |
| Fondo secundario frío | `#EFF8FC` |
| Texto y títulos | `#102D43` |
| Azul principal | `#075985` |
| Botón destacado | `#C2410C`, texto blanco |

Tipografía propuesta: Plus Jakarta Sans en títulos y cuerpo, con pesos 400/600/700. Es una adaptación de la alternativa de familia única que aparece en el catálogo de ui-ux-pro-max; no se adopta su estilo neumórfico.

Composición: cabecera blanca con logo; hero con texto oscuro a la izquierda y fotografía a la derecha; acentos cálidos reservados a acciones; bloques informativos claros con separadores y poco relieve. En móvil, texto y acciones antes de la fotografía.

Ventaja para este proyecto: mantiene continuidad con el logo y ofrece una renovación visible con una sola familia tipográfica. Evitar que todos los servicios sean tarjetas idénticas: usar jerarquías y agrupaciones con sentido.

## B — Calm & Established

Sensación: sobria, ordenada, orientada a confianza y decisiones de instalación.

| Función | Color |
| --- | --- |
| Fondo principal | `#FAFAF7` |
| Fondo secundario | `#EEEFEA` |
| Texto y títulos | `#182D38` |
| Azul principal/botón | `#155E75`, texto blanco |
| Acento decorativo | `#D97706` |

Tipografía propuesta: Poppins en títulos y Open Sans en cuerpo, la combinación profesional sugerida por la skill. Cargar solo los pesos necesarios de cada familia.

Composición: fotografías amplias, encabezados contenidos, espacios generosos y más presencia de historia/proceso. Logo sobre blanco en la cabecera; naranja para detalles, no para texto pequeño sobre fondo claro.

Tradeoff: tiene más recursos tipográficos que A y puede parecer demasiado institucional si el hero no comunica de inmediato reparación y contacto.

## C — Bold & Responsive

Sensación: enérgica y técnica, con más presencia del contraste y de las llamadas a la acción.

| Función | Color |
| --- | --- |
| Fondo de hero/cierre | `#102A3A` |
| Superficies de contenido | `#FFFFFF` |
| Texto sobre fondo oscuro | `#F5FAFC` |
| Acento/botón cálido | `#FBBF24`, texto `#102A3A` |
| Acento frío decorativo | `#67D4E8` |

Tipografía propuesta: Poppins en títulos y cuerpo, pesos 400/600/700. Una familia como alternativa geométrica más enfática.

Composición: cabecera blanca para preservar visibilidad del logo, hero oscuro con fotografía y texto fuera de la imagen, secciones interiores claras. El oscuro se concentra en hero y cierre; no se convierte todo el sitio en una interfaz oscura.

Tradeoff: requiere más cuidado para que el contraste visual no compita con el logo ni sugiera promesas de urgencia que el negocio no haya confirmado.

## Recomendación

Elegir A como base: es compatible con los colores actuales, comunica frescura y admite tanto servicio urgente como instalaciones y confianza sin priorizar uno en detrimento del resto. B es la alternativa si se prefiere una presencia más sobria; C si se busca más energía visual.

## Pendiente para el diseño concreto

Conexión de Pencil recuperada después de que el usuario abriera la app. Diseño actual: `../pencil-design/airturbulencia.pen`. Documentación y vistas exportadas: `05-homepage-design-review.md`.
