import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LicenseService } from '../../services/licenses';
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
  selector: 'app-licenses',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl: './licenses.html',
  styleUrls: ['./licenses.css']
})
export class LicensesComponent implements OnInit, OnDestroy {
  licenses: any[] = [];
  loading = false;
  addingLicense: any = null;
  isAdmin = false;
  logoutSub!: Subscription;
  constructor(private licenseService: LicenseService, private snackBar: MatSnackBar, private adminService: AdminService, private sessionService: SessionService) {}

  ngOnInit() {
    this.loadLicenses();
    this.checkAdmin();

    this.logoutSub = this.sessionService.logout$.subscribe(() => {
      this.isAdmin = false;
      this.loadLicenses();
    });
  }

  loadLicenses() {
    this.loading = true;
    this.licenseService.getAll().subscribe({
      next: (data) => {
        this.licenses = data;
        this.loading = false; // dejamos de cargar
      },
      error: (err) => {
        console.error('Error cargando licencias:', err);
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
    this.addingLicense = {
        nombre: '',
        apellidos: '',
        rango_sahp: '',
        fecha_nacimiento: '',
        telefono: '',
        foto: '',
        num_placa: ''
    };
  }

  addLicense() {
    // this.licenseService.create({
    //   name: this.addingLicense.nombre,
    //   apellidos: this.addingLicense.apellidos,
    //   rango_sahp: this.addingLicense.rango_sahp,
    //   fecha_nacimiento: this.addingLicense.fecha_nacimiento,
    //   telefono: this.addingLicense.telefono,
    //   foto: this.addingLicense.foto,
    //   num_placa: this.addingLicense.num_placa
    // }).subscribe(() => {
    //   this.addingLicense = null;
    //   this.loadLicenses();
    // });
  }

  deleteInstructor(id: number) {
    // if (this.adminService.checkAdmin() === false) {
    //   this.snackBar.open('No tienes permisos para borrar instructores', 'Cerrar', { duration: 3000 });
    //   return;
    // }
    // this.instructorService.delete(id).subscribe(() => {
    //   this.loadInstructors();
    // });
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

  confirmDelete(id: number) {
    // this.instructorService.delete(id).subscribe(() => {
    //   this.confirmDeleteId = null;
    //   this.loadInstructors();
    // });
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
    // this.instructorService.update(this.editingInstructor.state_id, {
    //   nombre: this.editingInstructor.nombre,
    //   apellidos: this.editingInstructor.apellidos,
    //   rango_sahp: this.editingInstructor.rango_sahp,
    //   fecha_nacimiento: this.editingInstructor.fecha_nacimiento,
    //   telefono: this.editingInstructor.telefono,
    //   foto: this.editingInstructor.foto,
    //   num_placa: this.editingInstructor.num_placa
    // }).subscribe(() => {
    //   this.editingInstructor = null;
    //   this.loadInstructors();
    // });
  }

  ngOnDestroy() {
    this.logoutSub?.unsubscribe();
  }

  toggleLicenseStatus(id: number, license: any) {
    if (!this.adminService.checkAdmin()) {
      this.snackBar.open(
        'No tienes permisos para cambiar el estado de la licencia',
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }

    this.licenseService.update(id, {
      name: license.name,
      image_url: license.image_url,
      title: license.title,
      description: license.description,
      required: license.required,
      exempt: license.exempt,
      active: !license.active
    }).subscribe({
      next: () => this.loadLicenses(),
      error: err => console.error(err)
    });
  }
}
  