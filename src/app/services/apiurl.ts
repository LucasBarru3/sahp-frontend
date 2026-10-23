import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {
  // Cambia esta URL por la de tu backend en Vercel
  private apiUrl = 'https://sahp-backend.vercel.app';

  getApiUrl(): string {
    return this.apiUrl;
  }
}