import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/vehicle';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../components/loader/loader';
import { jwtDecode } from 'jwt-decode';
import { ClassService } from '../../services/class';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionService } from '../../services/session';
@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './vehicles.html',
  styleUrls: ['./vehicles.css']
})
export class VehiclesComponent implements OnInit, OnDestroy {
  editingVehicle: any = null;
  addingVehicle: any = null;
  vehicles: any[] = [];
  classId!: number;
  imageOk = true;
  loading = false;
  isAdmin = false;
  classes: any[] = [];
  logoutSub!: Subscription;
  constructor(
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private classService: ClassService,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private sessionService: SessionService
  ) {}

  startEdit(vehicle: any) {
    if (this.adminService.checkAdmin() === false) {
      this.snackBar.open('No tienes permisos para editar vehículos', 'Cerrar', { duration: 3000 });
      return;
    }
    this.editingVehicle = {
      ...vehicle,
      image_url: vehicle.image_url || '',  // Si es null o undefined, ponemos ''
      follow_class: vehicle.follow_class || '',
      tuned: vehicle.tuned || '',
      note: vehicle.note || ''
    };
  }

  get classLabel(): string {
    switch (this.classId) {
      case 1: return 'B';
      case 2: return 'A';
      case 3: return 'S+';
      case 4: return 'C';
      default: return '';
    }
  }

  selectedImage: string | null = null;

  openImage(url: string) {
    this.selectedImage = url;
  }

  closeImage() {
    this.selectedImage = null;
  }

  startAdd() {
    if (this.adminService.checkAdmin() === false) {
      this.snackBar.open('No tienes permisos para crear vehículos', 'Cerrar', { duration: 3000 });
      return;
    }
    this.addingVehicle = {
      name: '',
      model: '',
      image_url: '',
      class_id: this.classId,
      follow_class: '',
      tuned: '',
      note: ''
    };
  }

  onImageLoad() {
    this.imageOk = true;
  }

  onImageError() {
    this.imageOk = false;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.classId = +params['classId'];
      this.loadVehicles();
    });
    this.checkAdmin()
    this.classService.getAll().subscribe({
      next: data => {
        this.classes = data;
      },
      error: err => {
        console.error('Error cargando clases:', err);
      }
    });
    this.logoutSub = this.sessionService.logout$.subscribe(() => {
      this.isAdmin = false;
      this.loadVehicles();
    });
  }

  loadVehicles() {
    this.loading = true;
    this.vehicleService.getByClass(this.classId).subscribe(data => {
      this.vehicles = data;
      this.loading = false;
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

  editVehicle() {
    this.vehicleService.update(this.editingVehicle.id, {
      name: this.editingVehicle.name,
      model: this.editingVehicle.model,
      image_url: this.editingVehicle.image_url,
      class_id: this.editingVehicle.class_id,
      follow_class: this.editingVehicle.follow_class,
      tuned: this.editingVehicle.tuned,
      note: this.editingVehicle.note
    }).subscribe(() => {
      this.editingVehicle = null;
      this.snackBar.open('Vehículo actualizado con éxito', 'Cerrar', { duration: 3000 });
      this.loadVehicles();
    });
  }

  addVehicle() {
    this.vehicleService.create( {
      name: this.addingVehicle.name,
      model: this.addingVehicle.model,
      image_url: this.addingVehicle.image_url,
      class_id: this.addingVehicle.class_id,
      follow_class: this.addingVehicle.follow_class,
      tuned: this.addingVehicle.tuned,
      note: this.addingVehicle.note
    }).subscribe(() => {
      this.addingVehicle = null;
      this.loadVehicles();
      this.snackBar.open('Vehículo añadido con éxito', 'Cerrar', { duration: 3000 });
    });
  }

  deleteVehicle(id: number) {
    if (this.adminService.checkAdmin() === false) {
      this.snackBar.open('No tienes permisos para borrar vehículos', 'Cerrar', { duration: 3000 });
      return;
    }
    this.vehicleService.delete(id).subscribe({
      next: () => {
        this.loadVehicles();
        this.snackBar.open('Vehículo eliminado con éxito', 'Cerrar', { duration: 3000 });
      },
      error: err => console.error('Error eliminando:', err)
    });
  }

  copyModel(model: string) {
    navigator.clipboard.writeText(model).then(() => {
    }).catch(err => console.error('Error copiando al portapapeles:', err));
    this.snackBar.open('Modelo copiado al portapapeles', 'Cerrar', { duration: 2000 });
  }

  ngOnDestroy() {
    this.logoutSub?.unsubscribe();
  }
}
