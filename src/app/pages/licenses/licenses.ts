import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LICENSES } from '../../config/license';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { AdminService } from '../../services/admin';

@Component({
  selector: 'app-licenses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './licenses.html',
  styleUrls: ['./licenses.css']
})
export class LicensesComponent {
  licenses = Object.values(LICENSES);
  isAdmin = false;

  constructor(private snackBar: MatSnackBar, private adminService: AdminService) {
    if (this.adminService.checkAdmin()) {
      this.isAdmin = true;
    }
  }
  toggleLicenseStatus(license: any) {
  if (this.adminService.checkAdmin() === false) {
    this.snackBar.open(
      'No tienes permisos para modificar licencias',
      'Cerrar',
      { duration: 3000 }
    );
    return;
  }

  license.active = !license.active;

  this.snackBar.open(
    `Licencia ${license.active ? 'ACTIVADA' : 'DESACTIVADA'}`,
    'OK',
    { duration: 2000 }
  );
}

}
