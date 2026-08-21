import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly STORAGE_KEY = 'language';

  constructor(private translate: TranslateService) {

    const language =
      localStorage.getItem(this.STORAGE_KEY) || 'es';

    this.translate.use(language);
  }

  setLanguage(language: string) {
    localStorage.setItem(this.STORAGE_KEY, language);
    this.translate.use(language);
  }

  getLanguage(): string {
    return localStorage.getItem(this.STORAGE_KEY) || 'es';
  }
}