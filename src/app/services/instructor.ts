import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  // Cambia esta URL por la de tu backend en Vercel
  private apiUrl = 'https://sahp-backend.vercel.app/api/instructors';

  constructor(private http: HttpClient) {}

  // Obtener todas las instructores
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear una nueva instructor
  create(data: { nombre: string, apellidos: string, rango_sahp?: string, fecha_nacimiento?: string, telefono?: string, foto?: string }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualizar instructor
  update(
    id: number,
    data: {
      nombre: string;
      apellidos: string;
      rango_sahp?: string;
      fecha_nacimiento?: string;
      telefono?: string;
      foto?: string;
    }
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}?state_id=${id}`,
      data
    );
  }

  // Eliminar clase
  delete(id: number) {
    // En serverless se pasa por query string
    return this.http.delete(`${this.apiUrl}?state_id=${id}`);
  }
}
