import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassService } from '../../services/class';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../../components/loader/loader';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl: './classes.html',
  styleUrls: ['./classes.css']
})
export class ClassesComponent implements OnInit {
  classes: any[] = [];
  loading = false;
  addingClass: any = null;
  isAdmin = false;
  constructor(private classService: ClassService) {}

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.loading = true;
    this.classService.getAll().subscribe({
      next: (data) => {
        this.classes = data;
        this.loading = false; // dejamos de cargar
      },
      error: (err) => {
        console.error('Error cargando clases:', err);
        this.loading = false; // también dejamos de cargar si hay error
      }
    });
    this.checkAdmin();
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

      startAdd() {
    this.addingClass = {
      name: '',
      description: '',
    };
  }

  addClass() {
    this.classService.create( {
      name: this.addingClass.name,
      description: this.addingClass.model,
    }).subscribe(() => {
      this.addingClass = null;
      this.loadClasses();
    });
  }

}
