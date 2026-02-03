import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorService } from '../../services/instructor';
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
  selector: 'app-instructores',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl: './instructores.html',
  styleUrls: ['./instructores.css']
})
export class InstructoresComponent implements OnInit, OnDestroy {
  instructors: any[] = [];
  loading = false;
  addingInstructor: any = null;
  isAdmin = false;
  totalInstructors: number = 0;
  logoutSub!: Subscription;
  constructor(private instructorService: InstructorService, private snackBar: MatSnackBar, private adminService: AdminService, private sessionService: SessionService) {}

  ngOnInit() {
    this.loadInstructors();
    this.checkAdmin();

    this.logoutSub = this.sessionService.logout$.subscribe(() => {
      this.isAdmin = false;
      this.loadInstructors();
    });
  }

  loadInstructors() {
    this.loading = true;
    this.instructorService.getAll().subscribe({
      next: (data) => {
        this.instructors = data;
        if (data.length > 0) {
        this.totalInstructors = data[0].instructor_count;
        }
        this.loading = false; // dejamos de cargar
      },
      error: (err) => {
        console.error('Error cargando instructores:', err);
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
      this.snackBar.open('No tienes permisos para crear instructores', 'Cerrar', { duration: 3000 });
      return;
    }
    this.addingInstructor = {
        nombre: '',
        apellidos: '',
        rango_sahp: '',
        state_id: 0,
        fecha_nacimiento: '',
        telefono: '',
        foto: '',
        num_placa: ''
    };
  }

  addInstructor() {
    this.instructorService.create({
      nombre: this.addingInstructor.nombre,
      apellidos: this.addingInstructor.apellidos,
      rango_sahp: this.addingInstructor.rango_sahp,
      state_id: this.addingInstructor.state_id,
      fecha_nacimiento: this.addingInstructor.fecha_nacimiento,
      telefono: this.addingInstructor.telefono,
      foto: this.addingInstructor.foto,
      num_placa: this.addingInstructor.num_placa
    }).subscribe(() => {
      this.addingInstructor = null;
      this.loadInstructors();
    });
  }

  confirmDeleteId: number | null = null;

  askDelete(id: number) {
    if (this.adminService.checkAdmin() === false) {
      this.snackBar.open('No tienes permisos para borrar instructores', 'Cerrar', { duration: 3000 });
      return;
    }
    this.confirmDeleteId = id;
  }

  cancelDelete() {
    this.confirmDeleteId = null;
  }

  confirmDelete(instructor: any) {
    this.instructorService.delete(instructor).subscribe(() => {
      this.confirmDeleteId = null;
      this.loadInstructors();
    });
  }

  editingInstructor: any = null;

  startEdit(instructor: any) {
    if (this.adminService.checkAdmin() === false) {
      this.snackBar.open('No tienes permisos para editar instructores', 'Cerrar', { duration: 3000 });
      return;
    }
    this.editingInstructor = {
      ...instructor,
      fecha_nacimiento: instructor.fecha_nacimiento
        ? instructor.fecha_nacimiento.substring(0, 10)
        : ''
    };
  }

  cancelEdit() {
    this.editingInstructor = null;
  }

  saveEdit() {
    this.instructorService.update(this.editingInstructor.state_id, {
      nombre: this.editingInstructor.nombre,
      apellidos: this.editingInstructor.apellidos,
      rango_sahp: this.editingInstructor.rango_sahp,
      state_id: this.editingInstructor.state_id,
      fecha_nacimiento: this.editingInstructor.fecha_nacimiento,
      telefono: this.editingInstructor.telefono,
      foto: this.editingInstructor.foto,
      num_placa: this.editingInstructor.num_placa
    }).subscribe(() => {
      this.editingInstructor = null;
      this.loadInstructors();
    });
  }

  copyTel(tel: string) {
    navigator.clipboard.writeText(tel).then(() => {
    }).catch(err => console.error('Error copiando al portapapeles:', err));
    this.snackBar.open(
      'Número copiado al portapapeles',
      'Cerrar',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-progress']
      }
    );
  }

  ngOnDestroy() {
    this.logoutSub?.unsubscribe();
  }
}
  