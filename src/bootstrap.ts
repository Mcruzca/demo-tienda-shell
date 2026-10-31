import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import './app/estado-tienda'; // Publica window.tiendaEstado antes de cargar los módulos.

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
