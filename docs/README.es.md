[English](../README.md) | [简体中文](../README.zh-CN.md) | [日本語](../docs/README.ja.md) | [한국어](../docs/README.ko.md) | [Español](../docs/README.es.md) | [Deutsch](../docs/README.de.md) | [Русский](../docs/README.ru.md)

<p align="center"><img src="../site/mark.svg" width="64" alt="SandKit"></p>

# SandKit

Convierte imágenes y texto en animaciones de arena interactivas.

[MIT](../LICENSE) · WebGL2 · [Linkly AI](https://linkly.ai/)

## Empezar en Codex

Pega esta instrucción en Codex:

> Lee https://github.com/LinklyAI/SandKit/blob/main/GETTING_STARTED.md y sigue las instrucciones para configurar las dos skills de SandKit; después crea y ejecuta una demo interactiva de arena en este directorio con los ejemplos incluidos.

La primera ejecución utiliza los ejemplos incluidos. Para generar imágenes propias necesitas una sesión de Codex con generación de imágenes. Pueden aparecer solicitudes de permiso del entorno.

## Ejecutar en local

Requiere Node.js 22 o posterior. El núcleo, la demo y el editor no necesitan instalar dependencias.

```sh
git clone https://github.com/LinklyAI/SandKit.git
cd SandKit
node scripts/serve.mjs
```

- Demo: `http://127.0.0.1:4173/site/`
- Editor: `http://127.0.0.1:4173/site/editor/`

## Contenido

- Renderizador WebGL2 independiente del framework y adaptador opcional para React.
- Editor con 30 parámetros numéricos, ajustes predefinidos, colores, texto, reproducción, inspección de dibujo y profundidad, importación/exportación JSON y enlaces compartibles.
- **[sandkit-art](../skills/sandkit-art/SKILL.md)**: Creación y validación de dibujos y mapas de profundidad estimada.
- **[sandkit-build](../skills/sandkit-build/SKILL.md)**: Creación, integración y optimización del código de animación.
- Dibujos y mapas de profundidad de un cerebro, un Macintosh, una pila de libros y una máquina de escribir.

La web ofrece demos y entrada de texto en inglés y chino. Las imágenes personalizadas se crean con las skills en Codex. La profundidad es una estimación para el paralaje, no una medición 3D precisa.

![SandKit](../skills/sandkit-art/assets/typewriter.webp)

## Desarrollo y documentación

```sh
node scripts/check.mjs
node --test tests/*.test.js
node scripts/build.mjs
```

La compilación estática se genera en dist/sandkit/. El despliegue en la web oficial y la publicación del paquete son tareas independientes; no se afirma que ya estén publicados.

[API (English)](API.md) · [README (English)](../README.md) · [Contributing (English)](../CONTRIBUTING.md) · [Security (English)](../SECURITY.md)

## Licencia

MIT. Los ejemplos generados se ofrecen bajo las mismas condiciones en la medida de los derechos disponibles. No se conceden derechos de marca.

[MIT](../LICENSE) · [Asset provenance (English)](../skills/sandkit-art/assets/PROVENANCE.md)

## Built with Linkly AI

Linkly AI es el cerebro de conocimiento para agentes de IA. Permite que tu agente busque y lea tus notas, documentos, audios y vídeos.

[Linkly AI](https://linkly.ai/#get-started) · [X @linkly_ai](https://x.com/linkly_ai)
