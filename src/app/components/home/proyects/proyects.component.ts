import { Component } from '@angular/core';
import { projects } from './service/projects';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrl: './proyects.component.scss',
  standalone: false,
})
export class ProyectsComponent {
  public projects = projects;
}
