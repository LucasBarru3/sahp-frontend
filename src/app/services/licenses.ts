import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  // Cambia esta URL por la de tu backend en Vercel
  private apiUrl = 'https://sahp-backend.vercel.app/api/licenses';

  constructor(private http: HttpClient) {}

  // Obtener todas las licencias
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear una nueva licencia
  create(data: { name: string, image_url: string, title?: string, description?: string, required?: string, exempt?: string, active?: string }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualizar licencia
  update(
    id: number,
    data: {
      name: string;
      image_url: string;
      title?: string;
      description?: string;
      required?: string;
      exempt?: string;
      active?: boolean;
    }
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}?id=${id}`,
      data
    );
  }

  // Eliminar clase
  delete(id: number) {
    // En serverless se pasa por query string
    return this.http.delete(`${this.apiUrl}?id=${id}`);
  }
}
