import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '../../services/session';
import { AdminService } from '../../services/admin';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  constructor(
    private snackBar: MatSnackBar,
    private sessionService: SessionService,
    private adminService: AdminService
  ) {}
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem('token'); // token expirado
        return false;
      }
      return true; // token válido
    } catch (err) {
      return false;
    }
  }
  isAdmin2(): boolean {
    return this.adminService.checkAdmin2();
  }
  logout() {
    localStorage.removeItem('token');
    this.sessionService.notifyLogout();
    this.snackBar.open('Sesión cerrada con éxito', 'Cerrar', { duration: 3000 });
  }
  getUsername(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.username || null;
    } catch {
      return null;
    }
  }
}
