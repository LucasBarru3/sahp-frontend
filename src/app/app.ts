import { Component, signal, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Registramos el locale español
registerLocaleData(localeEs);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], // corregido: era styleUrl → styleUrls
  providers: [
    { provide: LOCALE_ID, useValue: 'es' } // Seteamos español como locale global
  ]
})
export class App {
  protected readonly title = signal('sahp-frontend');
}
