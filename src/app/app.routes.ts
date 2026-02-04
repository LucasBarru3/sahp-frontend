import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { ClassesComponent } from './pages/classes/classes';
import { VehiclesComponent } from './pages/vehicles/vehicles';
import { AllVehiclesComponent } from './pages/all-vehicles/all-vehicles';
import { LoginComponent } from './components/login/login';
import { InstructoresComponent } from './pages/instructores/instructores';
import { LicensesComponent } from './pages/licenses/licenses';
import { AdminComponent } from './pages/admin/admin';
import { AdminGuard } from './guards/admin.guard';
import { Admin2Guard } from './guards/admin2.guard';
import { LogsComponent } from './pages/logs/logs';
export const routes: Routes = [
{ path: '', component: Inicio },
{ path: 'classes', component: ClassesComponent },
{ path: 'instructors', component: InstructoresComponent },
{ path: 'vehicles/:classId', component: VehiclesComponent },
{ path: 'vehicles-all', component: AllVehiclesComponent },
{ path: 'login', component: LoginComponent },
{ path: 'licenses', component: LicensesComponent },
{ path: 'admin', component: AdminComponent, canActivate: [Admin2Guard] },
{ path : 'logs', component: LogsComponent, canActivate: [AdminGuard] }
];
