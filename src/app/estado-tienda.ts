// ESTADO COMPARTIDO de la tienda. El shell es el dueño y lo publica en window.tiendaEstado,
// así cualquier módulo (Angular o JS) lo usa sin importar nada del shell.
//   igv        → solo lectura: lo fija el shell (18 %). Los módulos solo lo leen.
//   descuento  → editable: cualquier módulo puede cambiarlo con tiendaEstado.set('descuento', 10).
// CONTRATO: cada cambio lanza en window 'tienda:estado-cambio'  detail: { clave, valor }.
export interface EstadoTienda { igv: number; descuento: number; }

const SOLO_LECTURA: (keyof EstadoTienda)[] = ['igv'];
const valores: EstadoTienda = { igv: 18, descuento: 0 };

export const tiendaEstado = {
 get<K extends keyof EstadoTienda>(clave: K): EstadoTienda[K] { return valores[clave]; },
 set<K extends keyof EstadoTienda>(clave: K, valor: EstadoTienda[K]) {
   if (SOLO_LECTURA.includes(clave)) { console.warn(`"${clave}" es del shell: los módulos solo pueden leerla.`); return; }
   if (clave === 'descuento' && !(typeof valor === 'number' && valor >= 0 && valor <= 100)) { console.warn(`Descuento inválido: ${valor}. Debe ser un número entre 0 y 100.`); return; }
   valores[clave] = valor;
   window.dispatchEvent(new CustomEvent('tienda:estado-cambio', { detail: { clave, valor } }));
 },
 // Total final de cada pedido (con descuento e IGV). El shell lo guarda en localStorage;
 // la API solo conoce el subtotal. Carrito lo guarda al finalizar y Pedidos lo lee.
 guardarTotalPedido(id: number, total: number) {
   const totales = leerTotales(); totales[id] = total;
   try { localStorage.setItem(CLAVE_TOTALES, JSON.stringify(totales)); } catch {}
 },
 totalPedido(id: number): number | undefined { return leerTotales()[id]; }
};

const CLAVE_TOTALES = 'tienda:totales-pedidos';
function leerTotales(): Record<number, number> {
 try { return JSON.parse(localStorage.getItem(CLAVE_TOTALES) ?? '{}'); } catch { return {}; }
}

declare global { interface Window { tiendaEstado: typeof tiendaEstado; } }
window.tiendaEstado = tiendaEstado; // Se publica antes de cargar cualquier módulo remoto.
