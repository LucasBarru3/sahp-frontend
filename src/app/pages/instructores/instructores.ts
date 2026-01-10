import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorService } from '../../services/instructor';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../../components/loader/loader';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-instructores',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl: './instructores.html',
  styleUrls: ['./instructores.css']
})
export class InstructoresComponent implements OnInit {
  instructors: any[] = [];
  loading = false;
  addingInstructor: any = null;
  isAdmin = false;
  totalInstructors: number = 0;
  constructor(private instructorService: InstructorService) {}

  ngOnInit() {
    this.loadInstructors();
    this.checkAdmin();
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
        console.error('Token inválido', err);
        return false;
      }
    }

  startAdd() {
    this.addingInstructor = {
        nombre: '',
        apellidos: '',
        rango_sahp: '',
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
      fecha_nacimiento: this.addingInstructor.fecha_nacimiento,
      telefono: this.addingInstructor.telefono,
      foto: this.addingInstructor.foto,
      num_placa: this.addingInstructor.num_placa
    }).subscribe(() => {
      this.addingInstructor = null;
      this.loadInstructors();
    });
  }

  deleteInstructor(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este instructor?')) {
      return;
    }

    this.instructorService.delete(id).subscribe(() => {
      this.loadInstructors();
    });
  }

  editingInstructor: any = null;

  startEdit(instructor: any) {
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
      fecha_nacimiento: this.editingInstructor.fecha_nacimiento,
      telefono: this.editingInstructor.telefono,
      foto: this.editingInstructor.foto,
      num_placa: this.editingInstructor.num_placa
    }).subscribe(() => {
      this.editingInstructor = null;
      this.loadInstructors();
    });
  }
}
