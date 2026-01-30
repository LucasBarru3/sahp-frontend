import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  // Cambia esta URL por la de tu backend en Vercel
  private apiUrl = 'https://sahp-backend.vercel.app/api/vehicles';

  constructor(private http: HttpClient) {}

  // Método para obtener las cabeceras con el token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Obtener todos los vehículos
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener vehículos por clase
  getByClass(classId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?classId=${classId}`);
  }

  // Crear un vehículo
  create(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, data, { headers });
  }

  // Actualizar un vehículo
  update(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    // agregamos id al body porque tu backend lo espera allí
    return this.http.put<any>(this.apiUrl, { id, ...data }, { headers });
  }

  // Eliminar un vehículo
  delete(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.request('delete', this.apiUrl, { body: { id }, headers });
  }
}