import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../services/vehicle';
import { LoaderComponent } from '../../components/loader/loader';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-all-vehicles',
  standalone: true,
  imports: [CommonModule, LoaderComponent, FormsModule, RouterModule],
  templateUrl: './all-vehicles.html',
  styleUrls: ['./all-vehicles.css']
})
export class AllVehiclesComponent implements OnInit {
  imageOk = true;
  vehicles: any[] = [];
  loading = false;
  editingVehicle: any = null;
  searchText = '';
  selectedClass = '';
  sortOrder = 'az';
  filteredVehicles: any[] = [];

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.loadVehicles();
  }

  onImageLoad() {
    this.imageOk = true;
  }

  onImageError() {
    this.imageOk = false;
  }

  loadVehicles() {
    this.loading = true;
    this.vehicleService.getAll().subscribe({
      next: data => {
        this.vehicles = data;
        this.applyFilters();
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let result = [...this.vehicles];

    // Buscar por nombre o modelo
    if (this.searchText) {
      const text = this.searchText.toLowerCase();
      result = result.filter(v =>
        v.name.toLowerCase().includes(text) ||
        v.model.toLowerCase().includes(text)
      );
    }

    // Filtrar por clase
    if (this.selectedClass) {
      result = result.filter(v => v.class_id == this.selectedClass);
    }

    // Ordenar
    result.sort((a, b) => {
      if (this.sortOrder === 'az') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    this.filteredVehicles = result;
  }

  ngDoCheck() {
    this.applyFilters();
  }

  deleteVehicle(id: number) {
    this.vehicleService.delete(id).subscribe({
      next: () => this.loadVehicles(),
      error: err => console.error('Error eliminando:', err)
    });
  }

  startEdit(vehicle: any) {
    this.editingVehicle = {
      ...vehicle,
      image_url: vehicle.image_url || '',  // Si es null o undefined, ponemos ''
      follow_class: vehicle.follow_class || '',
      note: vehicle.note || ''
    };
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

  getClassLabel(classId: number) {
    if (classId === 1) return 'B';
    if (classId === 2) return 'A';
    return 'S+';
  }

  copyModel(model: string) {
    navigator.clipboard.writeText(model).then(() => {
    }).catch(err => console.error('Error copiando al portapapeles:', err));
  }
}
