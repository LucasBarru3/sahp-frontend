import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if (!this.username || !this.password) {
      this.error = 'Rellena usuario y contraseña';
      return;
    }
    this.loading = true;
    this.error = '';
    this.http.post<any>('https://sahp-backend.vercel.app/api/auth', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']); // redirige a home
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
