import { Component, ElementRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

// Puente único para cualquier módulo JS: la ruta indica qué módulo descargar
// y qué etiqueta registra. El puente no sabe nada del interior del módulo.
@Component({
 standalone: true,
 template: `@if (estado()) { <p>{{ estado() }}</p> }`
})
export class PuenteJs {
 estado = signal('Cargando…');
 constructor() {
   const { remoto, expone, etiqueta } = inject(ActivatedRoute).snapshot.data;
   const host: HTMLElement = inject(ElementRef).nativeElement;
   loadRemoteModule(remoto, expone)
     .then(() => { this.estado.set(''); host.appendChild(document.createElement(etiqueta)); })
     .catch(() => this.estado.set(`No se pudo cargar el módulo ${remoto}. Revisa su servidor y recarga.`));
 }
}
