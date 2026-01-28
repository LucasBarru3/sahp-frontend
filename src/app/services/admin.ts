 import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

        // Comprueba si el token ha expirado
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

  // Obtener todas las instructores
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear una nueva instructor
  create(data: {username: string, password: string,}): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualizar instructor
  update(
    id: number,
    data: {
      username: string;
      password: string;
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
