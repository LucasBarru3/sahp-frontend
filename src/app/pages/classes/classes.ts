import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassService } from '../../services/class';
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
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl: './classes.html',
  styleUrls: ['./classes.css']
})
export class ClassesComponent implements OnInit, OnDestroy {
  classes: any[] = [];
  loading = false;
  addingClass: any = null;
  isAdmin = false;
  logoutSub!: Subscription;
  constructor(private classService: ClassService, private snackBar: MatSnackBar, private adminService: AdminService, private sessionService: SessionService) {}

  ngOnInit() {
    this.loadClasses();
    this.logoutSub = this.sessionService.logout$.subscribe(() => {
      this.isAdmin = false;
      this.loadClasses();
    });
  }

  loadClasses() {
    this.loading = true;
    this.classService.getAll().subscribe({
      next: (data) => {
        this.classes = data;
        this.loading = false; // dejamos de cargar
      },
      error: (err) => {
        console.error('Error cargando clases:', err);
        this.loading = false; // también dejamos de cargar si hay error
      }
    });
    this.checkAdmin();
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
      this.snackBar.open('No tienes permisos para crear clases', 'Cerrar', { duration: 3000 });
      return;
    }
    this.addingClass = {
      name: '',
      description: '',
    };
  }

  addClass() {
    this.classService.create( {
      name: this.addingClass.name,
      description: this.addingClass.model,
    }).subscribe(() => {
      this.addingClass = null;
      this.loadClasses();
      this.snackBar.open('Clase añadida con éxito', 'Cerrar', { duration: 3000 });
    });
  }

  deleteClass(id: number) {
    if (this.adminService.checkAdmin() === false) {
      this.snackBar.open('No tienes permisos para borrar clases', 'Cerrar', { duration: 3000 });
      return;
    }
    this.classService.delete(id).subscribe(() => {
      this.loadClasses();
      this.snackBar.open('Clase eliminada con éxito', 'Cerrar', { duration: 3000 });
    });
  }

  ngOnDestroy() {
    this.logoutSub?.unsubscribe();
  }
}
