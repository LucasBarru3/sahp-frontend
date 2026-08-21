import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import {
  provideTranslateService,
  provideTranslateLoader
} from '@ngx-translate/core';

import {
  TranslateHttpLoader,
  provideTranslateHttpLoader
} from '@ngx-translate/http-loader';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideZoneChangeDetection({
      eventCoalescing: true
    }),

    provideRouter(routes),

    provideHttpClient(),

    provideTranslateService({
      loader: provideTranslateLoader(
        TranslateHttpLoader
      )
    }),

    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    })
  ]
};