import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/vehicle';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../components/loader/loader';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './vehicles.html',
  styleUrls: ['./vehicles.css']
})
export class VehiclesComponent implements OnInit {
  editingVehicle: any = null;
  addingVehicle: any = null;
  vehicles: any[] = [];
  classId!: number;
  imageOk = true;
  loading = false;
  isAdmin = false;
  constructor(
    private vehicleService: VehicleService,
    private route: ActivatedRoute
  ) {}

  startEdit(vehicle: any) {
    this.editingVehicle = {
      ...vehicle,
      image_url: vehicle.image_url || '',  // Si es null o undefined, ponemos ''
      follow_class: vehicle.follow_class || '',
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
    this.addingVehicle = {
      name: '',
      model: '',
      image_url: '',
      class_id: this.classId,
      follow_class: '',
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
  
  createVehicle() {
    const data = { name: 'Nuevo', model: 'ModeloX', image_url: '', class_id: this.classId, follow_class: '', note: '' };
    this.vehicleService.create(data).subscribe(() => this.loadVehicles());
  }

  editVehicle() {
    this.vehicleService.update(this.editingVehicle.id, {
      name: this.editingVehicle.name,
      model: this.editingVehicle.model,
      image_url: this.editingVehicle.image_url,
      class_id: this.editingVehicle.class_id,
      follow_class: this.editingVehicle.follow_class,
      note: this.editingVehicle.note
    }).subscribe(() => {
      this.editingVehicle = null;
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
      note: this.addingVehicle.note
    }).subscribe(() => {
      this.addingVehicle = null;
      this.loadVehicles();
    });
  }

  deleteVehicle(id: number) {
    this.vehicleService.delete(id).subscribe({
      next: () => this.loadVehicles(),
      error: err => console.error('Error eliminando:', err)
    });
  }

  copyModel(model: string) {
    navigator.clipboard.writeText(model).then(() => {
    }).catch(err => console.error('Error copiando al portapapeles:', err));
  }

}
