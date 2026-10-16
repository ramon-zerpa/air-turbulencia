# Air Turbulencia — Brief de rediseño

Fecha: 2026-10-15. Estado: alcance confirmado; arquitectura propuesta y decisiones visuales pendientes.

## Decisiones confirmadas por el usuario

- Rediseñar https://www.airturbulencia.com/ con Astro y una imagen fresca y moderna.
- Alcance confirmado: todo el sitio, comenzando por aprobar el inicio y luego extender el sistema visual a las páginas interiores.
- El agente se encargará de localizar y preparar recursos y repositorio cuando sea necesario. No se requiere que el usuario los entregue como requisito para planificar.
- Primera entrega solo en inglés. Español queda fuera del alcance actual.
- Conservar el logo sin modificarlo. Se pueden proponer nuevos colores y fuentes.
- Conservar aproximadamente el 70% de la esencia del contenido; el 30% restante representa margen editorial para mejorar claridad, estructura y conversión. No es una cuota literal de palabras.
- Atender los tres objetivos: generar llamadas y solicitudes, captar instalaciones/reemplazos y reforzar imagen y confianza. No hay una prioridad relativa confirmada.
- Plataforma elegida: Cloudflare. Configurar la integración Git con GitHub cuando se identifique el repositorio. Los despliegues posteriores serán automáticos por push autorizado.
- Trabajo actual local. No hay autorización para publicar o hacer push.

## Propuesta de experiencia, por validar

Atender dos recorridos: quien necesita resolver una avería y quien está evaluando una instalación o reemplazo. Usar la confianza como apoyo de ambos, con evidencia real de la empresa.

- Contacto telefónico y solicitud de servicio fáciles de encontrar en móvil.
- Instalaciones/reemplazos con beneficios claros, explicación del proceso y solicitud de evaluación.
- Servicios organizados para facilitar la selección sin perder páginas útiles para búsquedas locales.
- Financiación accesible desde el recorrido de instalación, con condiciones vigentes confirmadas.
- Fotografía de trabajos y equipo reales cuando esté disponible.
- Diseño tipográfico legible, espacios generosos e interacciones discretas que respeten movimiento reducido.

Dirección vigente: opción B (Calm & Established). Tras rechazar la propuesta A, el usuario solicitó empezar de cero con brand board primero y homepage solo desktop después. Paleta y tipografías B están propuestas en `06-brand-board-b.md`; la composición y la aprobación detallada siguen pendientes. A no es autoridad visual.

## Contenido y SEO

Requisito obligatorio del usuario: proteger el tráfico orgánico y el SEO acumulados. El rediseño debe mejorar lo existente sin retirar páginas, temas útiles ni señales de posicionamiento por razones estéticas. Mantener las URLs y la cobertura del sitemap; cualquier cambio de ruta justificado requerirá un mapeo y redirección 301 a su equivalente. El margen editorial queda subordinado a esta protección. Controles y condiciones de publicación: `03-seo-migration-plan.md`.

Conservar servicios, intención local y hechos del negocio. Mejorar textos repetitivos, jerarquía y llamadas a la acción. No inventar certificaciones, garantías, precios, testimonios ni disponibilidad.

Preparar un inventario completo de URLs antes de decidir consolidaciones. Conservar URLs útiles; si hay cambios aprobados, documentar redirecciones y enlaces internos. La revisión inicial de unas páginas no constituye un rastreo completo ni una auditoría técnica.

## Fuentes revisadas inicialmente

- Inicio: https://www.airturbulencia.com/
- Empresa: https://www.airturbulencia.com/about-air-turbulencia/
- Contacto: https://www.airturbulencia.com/contact/
- Financiación: https://www.airturbulencia.com/ac-financing-tampa/
- Cobertura: https://www.airturbulencia.com/air-turbulencia-service-area/
- El HTML del inicio referencia el logo en `/images/ac-installation-tampa-logo.png`, de 740 × 268. Es una referencia existente; no confirma que sea el original de mayor calidad.

Las páginas publicadas presentan reparación, instalación, mantenimiento, servicios comerciales y calefacción. Contacto publicado: (813) 815-1234, contacts@airturbulencia.com y 4023 W Cayuga St, Tampa, FL 33614. Verificar vigencia antes de publicar.

Pendientes comerciales identificados en el contenido actual: cobertura exacta, atención el mismo día/24 horas, certificaciones, garantías, acreditaciones y condiciones de financiación. Se registran como afirmaciones del sitio existente, no como hechos verificados de forma independiente. Algunas respuestas del buscador corresponden a capturas antiguas: contrastar con las páginas en vivo durante el inventario.

## Secuencia de trabajo

1. Cerrar alcance y recursos disponibles.
2. Inventariar URLs, contenido, recursos y formularios; establecer evidencia de rendimiento y SEO.
3. Proponer mapa del sitio, navegación y estructura de inicio.
4. Preparar direcciones visuales con ui-ux-pro-max y diseñar en Pencil escritorio/móvil para revisión.
5. Implementar el diseño aprobado en Astro y mostrarlo localmente.
6. Validar contenido, formularios, accesibilidad, SEO y rendimiento.
7. Con autorización de publicación, completar configuración GitHub–Cloudflare, publicar por push y verificar producción.

La conexión inicial puede prepararse antes de la publicación una vez identificado el repositorio y acordadas las condiciones de los despliegues de vista previa/producción. No se ha creado ni conectado ningún proyecto remoto.

## Preparación local

Se copiaron las diez skills del kit Astro a `.agents/skills`: ui-ux-pro-max, impeccable, web-design-guidelines, perf-astro, performance, core-web-vitals, seo, web-quality-seo, accessibility y web-quality-audit. Se leerán según la fase correspondiente.

## Preguntas abiertas

- Localizar repositorio GitHub existente o preparar uno nuevo cuando corresponda, verificando cuenta y destino antes de la conexión.
- Recuperar el logo publicado e inventariar fotografías; verificar calidad y disponibilidad de originales antes del diseño final.
- ¿Cómo deben recibirse las solicitudes del formulario y qué integraciones usa el negocio?

Inventario y propuesta de arquitectura: `02-site-architecture.md`, con evidencia en `evidence/site-inventory.json`. No se ha iniciado la aplicación ni elegido el diseño.
