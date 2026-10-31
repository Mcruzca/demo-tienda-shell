import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { tiendaEstado } from './estado-tienda';

// El shell arma la página: menú, cabecera y el apartado elegido.
// No escucha ni reenvía los avisos entre módulos: los módulos se hablan solos.
@Component({
 selector: 'app-root',
 imports: [RouterLink, RouterLinkActive, RouterOutlet],
 schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permite etiquetas propias como <tienda-contador>.
 template: `<header><div><small>SHELL ANGULAR · localhost:4500</small><h1>Mini tienda</h1>
   <nav><a routerLink="/compras" routerLinkActive="activo">Compras · Angular</a>
   <a routerLink="/carrito" routerLinkActive="activo">Carrito · JS</a>
   <a routerLink="/pedidos" routerLinkActive="activo">Pedidos · Angular</a></nav></div>
   <span class="estado" title="Variables del shell">IGV {{ igv }} % · Descuento {{ descuento() }} %</span>
   @if (contador()) { <tienda-contador /> } @else { <span>{{ estadoContador() }}</span> }</header>
 <main><router-outlet /></main>`
})
export class App {
 contador = signal(false);
 estadoContador = signal('…');
 // Variables del shell: el IGV es fijo; el descuento lo pueden cambiar los módulos.
 igv = tiendaEstado.get('igv');
 descuento = signal(tiendaEstado.get('descuento'));
 constructor() {
   window.addEventListener('tienda:estado-cambio', e => {
     const { clave, valor } = (e as CustomEvent).detail;
     if (clave === 'descuento') this.descuento.set(valor);
   });
   // El contador vive en la cabecera: está visible en todos los apartados.
   loadRemoteModule('contador', './Widget')
     .then(() => this.contador.set(true))
     .catch(() => this.estadoContador.set('Contador no disponible'));
   // La pieza compartida del carrito se registra una vez y queda disponible
   // para cualquier módulo que use <tienda-resumen-carrito> (Compras y Pedidos).
   loadRemoteModule('carrito', './Resumen').catch(() => console.warn('Resumen del carrito no disponible'));
 }
}
