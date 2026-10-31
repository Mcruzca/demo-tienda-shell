# Shell Angular · Mini tienda
Puerto 4500. `npm ci` y `npm start`. Apartados: /compras, /carrito y /pedidos. El contador va en la cabecera.
El shell no reenvía los avisos: los módulos se comunican solos con eventos en `window` y con la API.
Registra al arrancar `<tienda-resumen-carrito>`, la pieza compartida del carrito que usan Compras y Pedidos.

Orden para levantar todo (cada uno en su terminal):
1. `api-java` (repo aparte, en `C:\Users\Usuario\IdeaProjects\api-java`) → en IntelliJ, ▶ en `ApiJavaApplication` (4510)
2. `carrito` y `contador` → `npm start` (4502, 4503; sin dependencias)
3. `compras` y `pedidos` → `npm ci` y `npm start` (4501, 4504)
4. `shell` → `npm ci` y `npm start` (4500) y abre http://localhost:4500

## Variables del shell (`window.tiendaEstado`)
El shell es el dueño de un estado compartido (`src/app/estado-tienda.ts`) que cualquier módulo usa sin importar nada:
- `igv` (18 %): solo lectura. `tiendaEstado.get('igv')`. Si un módulo intenta cambiarla, el shell lo ignora.
- `descuento`: editable. `tiendaEstado.set('descuento', 10)`. Compras (Angular) lo cambia con el selector de cupón y Carrito (JS) con "Quitar cupón".
Cada cambio lanza `tienda:estado-cambio` con `{ clave, valor }` y todos se actualizan (cabecera, compras, carrito).
