import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  // Cambia esta URL por la de tu backend en Vercel
  private apiUrl = 'https://sahp-backend.vercel.app/api/instructors';

  constructor(private http: HttpClient) {}

  // Método para obtener las cabeceras con el token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Obtener todas las instructores
  getAll(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Crear una nueva instructor
  create(data: { nombre: string, apellidos: string, rango_sahp?: string, state_id?: number, fecha_nacimiento?: string, telefono?: string, foto?: string, num_placa?: string }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, data, { headers });
  }

  // Actualizar instructor
  update(
    id: number,
    data: {
      nombre: string;
      apellidos: string;
      rango_sahp?: string;
      state_id?: number;
      fecha_nacimiento?: string;
      telefono?: string;
      foto?: string;
      num_placa?: string;
    }
  ): Observable<any> {
    const headers = this.getAuthHeaders();
    // Corrigiendo la URL: parece que quieres usar el id en la query string
    return this.http.put(`${this.apiUrl}?state_id=${id}`, data, { headers });
  }

  // Eliminar instructor
  delete(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    // En serverless se pasa por query string
    return this.http.delete(`${this.apiUrl}?state_id=${id}`, { headers });
  }
}