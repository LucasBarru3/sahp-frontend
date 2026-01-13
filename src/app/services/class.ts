import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  // Cambia esta URL por la de tu backend en Vercel
  private apiUrl = 'https://sahp-backend.vercel.app/api/classes';

  constructor(private http: HttpClient) {}

  // Obtener todas las clases
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear una nueva clase
  create(data: { name: string, description: string }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualizar clase existente
  update(id: number, data: { name: string, description: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar clase
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}?id=${id}`);
  }
}
