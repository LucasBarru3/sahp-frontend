import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/vehicle';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../components/loader/loader';
@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './vehicles.html',
  styleUrls: ['./vehicles.css']
})
export class VehiclesComponent implements OnInit {
  editingVehicle: any = null;
  vehicles: any[] = [];
  classId!: number;
  imageOk = true;
  loading = false;
  constructor(
    private vehicleService: VehicleService,
    private route: ActivatedRoute
  ) {}

  startEdit(vehicle: any) {
    this.editingVehicle = {
      ...vehicle,
      image_url: vehicle.image_url || '',  // Si es null o undefined, ponemos ''
      follow_class: vehicle.follow_class || ''
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
  }

  loadVehicles() {
    this.loading = true;
    this.vehicleService.getByClass(this.classId).subscribe(data => {
      this.vehicles = data;
      this.loading = false;
    });
  }
  
  createVehicle() {
    const data = { name: 'Nuevo', model: 'ModeloX', image_url: '', class_id: this.classId, follow_class: '' };
    this.vehicleService.create(data).subscribe(() => this.loadVehicles());
  }

  editVehicle() {
    this.vehicleService.update(this.editingVehicle.id, {
      name: this.editingVehicle.name,
      model: this.editingVehicle.model,
      image_url: this.editingVehicle.image_url,
      class_id: this.editingVehicle.class_id,
      follow_class: this.editingVehicle.follow_class
    }).subscribe(() => {
      this.editingVehicle = null;
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
