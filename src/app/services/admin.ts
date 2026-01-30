import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  checkAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        localStorage.removeItem('token'); // token expirado
        return false;
      }
      return true;
    } catch (err) {
      console.error('Token inválido', err);
      return false;
    }
  }

  // Cambia esta URL por la de tu backend en Vercel
  private apiUrl = 'https://sahp-backend.vercel.app/api/users';

  constructor(private http: HttpClient) {}

  // Método para obtener las cabeceras con el token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Obtener todos los usuarios
  getAll(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Crear un nuevo usuario
  create(data: { username: string; password: string }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, data, { headers });
  }

  // Actualizar usuario
  update(
    id: number,
    data: {
      username: string;
      password: string;
    }
  ): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}?id=${id}`, data, { headers });
  }

  // Eliminar usuario
  delete(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    // En serverless se pasa por query string
    return this.http.delete(`${this.apiUrl}?id=${id}`, { headers });
  }
}