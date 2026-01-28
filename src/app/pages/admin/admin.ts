import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../../components/loader/loader';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionService } from '../../services/session';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  users: any[] = [];
  loading = false;
  addingUser: any = null;
  isAdmin = false;
  logoutSub!: Subscription;
  editingUserId: number | null = null;
  constructor( private snackBar: MatSnackBar, private adminService: AdminService, private sessionService: SessionService) {}

  ngOnInit() {
    this.loadUsers();
    this.checkAdmin();

    this.logoutSub = this.sessionService.logout$.subscribe(() => {
      this.isAdmin = false;
      this.loadUsers();
    });
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false; // dejamos de cargar
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
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

  startAdd() {
    if (this.adminService.checkAdmin() === false) {
      this.snackBar.open('No tienes permisos para crear usuarios', 'Cerrar', { duration: 3000 });
      return;
    }
    this.addingUser = {
        username: '',
        password: '',
    };
  }

  addUser() {
    this.adminService.create({
      username: this.addingUser.username,
      password: this.addingUser.password,
    }).subscribe(() => {
      this.addingUser = null;
      this.loadUsers();
    });
  }

  deleteInstructor(id: number) {
    if (this.adminService.checkAdmin() === false) {
      this.snackBar.open('No tienes permisos para borrar usuarios', 'Cerrar', { duration: 3000 });
      return;
    }
    this.adminService.delete(id).subscribe(() => {
      this.loadUsers();
    });
  }

  confirmDeleteId: number | null = null;

  askDelete(id: number) {
    if (this.adminService.checkAdmin() === false) {
      this.snackBar.open('No tienes permisos para borrar usuarios', 'Cerrar', { duration: 3000 });
      return;
    }
    this.confirmDeleteId = id;
  }

  cancelDelete() {
    this.confirmDeleteId = null;
  }

  confirmDelete(id: number) {
    this.adminService.delete(id).subscribe(() => {
      this.confirmDeleteId = null;
      this.loadUsers();
    });
  }

  editingUser: any = null;

  startEdit(user: any) {
    this.editingUserId = user.id;
    this.editingUser = {
      id: user.id,
      username: user.username,
      password: ''
    };
  }

  cancelEdit() {
    this.editingUserId = null;
    this.editingUser = null;
  }

  saveEdit() {
    if (!this.editingUser.username) {
      this.snackBar.open('El username no puede estar vacío', 'Cerrar', { duration: 3000 });
      return;
    }

    this.adminService.update(this.editingUser.id, {
      username: this.editingUser.username,
      password: this.editingUser.password || null
    }).subscribe(() => {
      this.snackBar.open('Usuario actualizado', 'OK', { duration: 2000 });
      this.cancelEdit();
      this.loadUsers();
    });
  }
  ngOnDestroy() {
    this.logoutSub?.unsubscribe();
  }
}
  