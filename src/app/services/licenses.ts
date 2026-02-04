import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  // Cambia esta URL por la de tu backend en Vercel
  private apiUrl = '/api/licenses';

  constructor(private http: HttpClient) {}

  // Método para obtener las cabeceras con el token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Obtener todas las licencias
  getAll(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Crear una nueva licencia
  create(data: { name: string, image_url: string, title?: string, description?: string, required?: string, exempt?: string, active?: number }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, data, { headers });
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
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}?id=${id}`, data, { headers });
  }

  // Eliminar licencia
  delete(license: any): Observable<any> {
    const headers = this.getAuthHeaders();
    // En serverless se pasa por query string
    return this.http.request('delete', this.apiUrl, {
      headers,
      body: license,
    });
  }
}