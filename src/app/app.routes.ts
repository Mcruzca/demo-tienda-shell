import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { PuenteJs } from './puente-js';

// Cada módulo en su propio apartado.
export const routes: Routes = [
 { path: '', pathMatch: 'full', redirectTo: 'compras' },
 // Angular: se recibe la clase del componente.
 { path: 'compras', loadComponent: () => loadRemoteModule('compras', './Compras').then(m => m.ComprasComponent) },
 { path: 'pedidos', loadComponent: () => loadRemoteModule('pedidos', './Pedidos').then(m => m.PedidosComponent) },
 // JavaScript: el puente genérico descarga el módulo y coloca su etiqueta.
 // Un módulo JS nuevo = una línea más aquí, sin código nuevo en el shell.
 { path: 'carrito', component: PuenteJs, data: { remoto: 'carrito', expone: './Widget', etiqueta: 'tienda-carrito' } },
 { path: '**', redirectTo: 'compras' }
];
