# Air Turbulencia — Inventario y arquitectura propuesta

Estado: propuesta para revisión; no constituye aprobación del diseño ni una auditoría SEO o de rendimiento completa.

## Evidencia de partida

Inventario obtenido de solicitudes directas a las páginas, sitemap y enlaces internos. Captura y resultados completos: `evidence/site-inventory.json`. Script reproducible: `../tools/inventory.py`.

- Se descubrieron 31 páginas HTML públicas con respuesta HTTP 200. No quedaron URLs pendientes en el recorrido descubierto.
- En estas 31 páginas se detectaron título, meta description, canonical y exactamente un H1. Esto verifica presencia, no calidad ni indexación.
- `robots.txt` y sitemap respondieron correctamente; `/sitemap.xml` redirige al índice de sitemaps.
- Se encontró además `/cdn-cgi/l/email-protection`, con respuesta 404 en la URL sin fragmento. Es una ruta técnica de protección de correo de Cloudflare, no una página editorial a migrar. No se interpreta por sí sola como fallo del correo para usuarios.
- Existe un formulario con ID `contact-form` en `/contact/`. El envío, validación, protección contra spam y destino no se han probado; no se enviaron solicitudes reales.
- Este inventario no descubre necesariamente páginas huérfanas ausentes tanto del sitemap como de los enlaces recorridos. Search Console/analítica, si están disponibles, permitirán contrastar URLs y tráfico antes de publicar.

## Inventario de páginas y tratamiento propuesto

Conservar las 31 rutas en la primera versión. Agrupar enlaces en navegación no implica fusionar páginas. Revisar títulos y copy por página, conservando su intención.

La conservación del SEO acumulado es requisito obligatorio. No reducir la cobertura temática ni modificar masivamente títulos/H1 por estética. Mantener cobertura y acceso del sitemap y aplicar el protocolo de `03-seo-migration-plan.md` antes de cualquier publicación. La propuesta de menú debe conservar enlaces HTML rastreables a todos los servicios y su relevancia en la arquitectura interna.

| Grupo | Rutas existentes |
| --- | --- |
| Inicio | `/` |
| Aire acondicionado: servicios principales | `/air-conditioning-installation-tampa/`, `/ac-repair-tampa/`, `/ac-maintenance-tampa/`, `/commercial-ac-tampa/`, `/ac-emergency-tampa/` |
| Aire acondicionado: sistemas | `/high-efficiency-ac-systems/`, `/ac-zone-control-systems-tampa/`, `/ductless-mini-split-systems-tampa/`, `/hvac-heat-pumps-tampa/`, `/thermostat-services-tampa/` |
| Calefacción: servicios principales | `/heating-installation-tampa/`, `/heating-repair-tampa/`, `/heating-maintenance-tampa/`, `/commercial-heating-tampa/`, `/heating-emergency-tampa/` |
| Calefacción: sistemas | `/hybrid-heating-systems-tampa/`, `/heating-zone-control-systems-tampa/`, `/heating-furnaces-tampa/`, `/packaged-hvac-units-tampa/`, `/heat-pumps-service-tampa/` |
| Financiación | `/ac-financing-tampa/` |
| Empresa y cobertura | `/about-air-turbulencia/`, `/why-choose-air-turbulencia/`, `/air-turbulencia-service-area/` |
| Recursos | `/hvac-tips-faqs/`, `/air-conditioning-tips-tampa/`, `/heating-tips-tampa/` |
| Contacto | `/contact/` |
| Legal | `/terms-conditions/`, `/privacy-policy/` |

## Navegación recomendada

Etiquetas del sitio en inglés:

- **Services**: grupos Air Conditioning, Heating y Systems & Efficiency. Mostrar primero reparación, instalación y mantenimiento. Cada servicio lleva a su URL actual. El control del menú será un botón accesible, sin crear una página `/services/` vacía ni una ruta nueva implícita.
- **Financing**: acceso directo a la página existente.
- **Service Area**: acceso directo a cobertura.
- **About Us**: empresa y enlace a Why Choose Us.
- **Resources**: FAQs, AC Tips y Heating Tips.
- **Request Service**: acción de contacto visible, acompañada del teléfono.

En móvil: menú agrupado y desplegable, acceso sencillo a llamar y solicitar servicio. Si se usa una barra fija, reservar espacio y comprobar que no oculte contenido, foco o mensajes del formulario.

## Estructura propuesta del inicio

1. **Cabecera**: logo original, navegación y contacto.
2. **Hero**: mensaje claro de HVAC en Tampa Bay y fotografía real del negocio o de trabajo verificada. Acciones sugeridas: `Request Service` y `Call (813) 815-1234`. Incluir enlace visible para quien busca instalación/reemplazo. Texto definitivo pendiente.
3. **Confianza**: experiencia y evidencia comercial verificadas. No introducir cifras, sellos ni promesas nuevas. Confirmar vigencia de reseñas, certificaciones y garantías antes de destacarlas.
4. **Servicios principales**: reparación, instalación/reemplazo, mantenimiento, comercial y calefacción. Urgencias visibles según disponibilidad confirmada.
5. **Instalación y reemplazo**: explicar evaluación, selección del sistema e instalación; CTA para solicitar evaluación. Enlace a financiación sin presentar cuotas no verificadas.
6. **La empresa**: conservar la historia y trato local del contenido existente, reduciendo repeticiones. Enlace a About Us.
7. **Reseñas**: testimonios existentes con atribución fiel y referencia a su fuente. No reescribir citas ni fijar un contador desactualizado.
8. **Cobertura**: resumen de zonas confirmadas y enlace a la lista completa.
9. **Preguntas frecuentes**: dudas de selección del servicio, proceso de contacto y equipos. Respuestas basadas en información comercial confirmada.
10. **Cierre y pie**: solicitud de servicio, teléfono, datos del negocio, páginas legales y enlaces secundarios.

El contacto principal llevará inicialmente a `/contact/`. Decidir si conviene un formulario en el inicio después de comprender el flujo actual y su impacto en experiencia y rendimiento.

## Plantillas para todo el sitio

- Inicio.
- Servicio/sistema: necesidad, alcance del servicio, proceso, evidencia, FAQs pertinentes y contacto.
- Empresa/por qué elegirnos: historia y diferenciadores comprobables, evitando duplicación extensa.
- Cobertura: localidades verificadas y acceso a servicios; no crear páginas locales repetitivas sin contenido útil.
- Financiación: explicación y condiciones vigentes del proveedor.
- Recursos: FAQs y consejos con estructura editorial legible.
- Contacto: datos, formulario, estados de envío y expectativa real de respuesta.
- Legal: contenido vigente con presentación consistente.

## Criterios técnicos para la siguiente etapa

- Astro con contenido renderizado en servidor/build y mínimo JavaScript cliente.
- Preservar URLs, enlaces internos y datos empresariales verificados.
- Optimizar imágenes y fuentes locales; reservar dimensiones para evitar saltos.
- Formularios con etiquetas, errores claros, estados accesibles y envío verificable.
- Diseñar y revisar escritorio y móvil en Pencil antes de implementar la dirección visual.
- Establecer medición de rendimiento antes de afirmar mejoras; no hay resultados Lighthouse/CrUX todavía.

## Decisión de revisión

Revisar esta navegación y la secuencia del inicio. Con esa base aceptada, recuperar y examinar el logo y las fotografías, y preparar dos o tres direcciones visuales coherentes. Elegir una antes de desarrollar el diseño detallado en Pencil.
