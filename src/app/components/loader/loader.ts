import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div class="overlay">
      <div class="spinner"></div>
    </div>
  `,
  styleUrls: ['./loader.css']
})
export class LoaderComponent {}
