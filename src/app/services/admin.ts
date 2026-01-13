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
}
