import { Routes } from '@angular/router';
import { ClassesComponent } from './pages/classes/classes';
import { VehiclesComponent } from './pages/vehicles/vehicles';
export const routes: Routes = [
{ path: '', component: ClassesComponent },
{ path: 'vehicles/:classId', component: VehiclesComponent }

];
