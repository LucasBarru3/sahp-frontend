import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  // Cambia esta URL por la de tu backend en Vercel
  private apiUrl = 'https://sahp-backend.vercel.app/api/vehicles';

  constructor(private http: HttpClient) {}

  // Obtener todos los vehículos
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener vehículos por clase
  getByClass(classId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?classId=${classId}`);
  }

create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

 update(id: number, data: any): Observable<any> {
    // agregamos id al body porque tu backend lo espera allí
    return this.http.put<any>(this.apiUrl, { id, ...data });
  }

  delete(id: number): Observable<any> {
    return this.http.request('delete', this.apiUrl, { body: { id } });
  }

}
