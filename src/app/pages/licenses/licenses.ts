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
  modalLicense: boolean = false;
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

  openCreateLicenseModal() {
    if (!this.adminService.checkAdmin()) {
      this.snackBar.open('No tienes permisos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.addingLicense = {
      name: '',
      image_url: '',
      title: '',
      description: '',
      required: '',
      exempt: '',
      active: 1 // 👈 CLAVE
    };

    this.modalLicense = true;
  }

  addLicense() {
    this.licenseService.create({
      name: this.addingLicense.name,
      image_url: this.addingLicense.image_url,
      title: this.addingLicense.title,
      description: this.addingLicense.description,
      required: this.addingLicense.required,
      exempt: this.addingLicense.exempt,
      active: this.addingLicense.active ? 1 : 0
    }).subscribe({
      next: () => {
        this.addingLicense = null;
        this.modalLicense = false;
        this.loadLicenses();

        this.snackBar.open('Licencia creada correctamente ✅', 'Cerrar', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al crear la licencia ❌', 'Cerrar', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  deleteLicense(id: number) {
    if (this.adminService.checkAdmin() === false) {
      this.snackBar.open('No tienes permisos para borrar licencias', 'Cerrar', { duration: 3000 });
      return;
    }
    this.licenseService.delete(id).subscribe(() => {
      this.loadLicenses();
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

  confirmDelete(id: number) {
    // this.instructorService.delete(id).subscribe(() => {
    //   this.confirmDeleteId = null;
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
  