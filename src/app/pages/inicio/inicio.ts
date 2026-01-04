import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ClassService } from '../../services/class';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-inicio',
  imports: [RouterModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  classes: any[] = [];
  loading = false;
  constructor(private classService: ClassService) {}

  ngOnInit() {
    this.loading = true; // empezamos cargando
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
  }
}
