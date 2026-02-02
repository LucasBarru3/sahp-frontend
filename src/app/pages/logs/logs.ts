import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { LogsService } from '../../services/logs';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionService } from '../../services/session';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './logs.html',
  styleUrls: ['./logs.css']
})
export class LogsComponent implements OnInit, OnDestroy {
  logs: any[] = [];
  loading = false;
  addingUser: any = null;
  isAdmin = false;
  logoutSub!: Subscription;
  editingUserId: number | null = null;
  constructor( private snackBar: MatSnackBar, private adminService: AdminService, private sessionService: SessionService, private router: Router, private logsService: LogsService) {}

  ngOnInit() {
    this.loadLogs();
    this.checkAdmin();

    this.logoutSub = this.sessionService.logout$.subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  loadLogs() {
    this.loading = true;
    this.logsService.getAll().subscribe({
      next: (data) => {
        this.logs = data;
        this.loading = false; // dejamos de cargar
      },
      error: (err) => {
        console.error('Error cargando logs:', err);
        this.loading = false; // también dejamos de cargar si hay error
      }
    });
  }
  
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
        this.isAdmin = true;
        return true; // token válido
      } catch (err) {
        return false;
      }
    }

  ngOnDestroy() {
    this.logoutSub?.unsubscribe();
  }
}
  