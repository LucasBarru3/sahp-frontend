// guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminService } from '../services/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AdminService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.checkAdmin()) {
      return true;
    }

    // si no es admin → redirigir
    this.router.navigate(['/login']);
    return false;
  }
}
