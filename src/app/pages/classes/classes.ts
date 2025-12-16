import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassService } from '../../services/class';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../../components/loader/loader';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './classes.html',
  styleUrls: ['./classes.css']
})
export class ClassesComponent implements OnInit {
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
