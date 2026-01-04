import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { ClassesComponent } from './pages/classes/classes';
import { VehiclesComponent } from './pages/vehicles/vehicles';
import { AllVehiclesComponent } from './pages/all-vehicles/all-vehicles';
export const routes: Routes = [
{ path: '', component: Inicio },
{ path: 'classes', component: ClassesComponent },
{ path: 'vehicles/:classId', component: VehiclesComponent },
{ path: 'vehicles-all', component: AllVehiclesComponent },
];
