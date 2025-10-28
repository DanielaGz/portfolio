import { Component } from '@angular/core';
import { projects } from './service/projects';
import { SelectedProjectService } from './service/selected-project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrl: './proyects.component.scss',
  standalone: false,
})
export class ProyectsComponent {
  public projects = projects;

  constructor(
    private selectedProjectService: SelectedProjectService,
    private router: Router
  ) {}

  selectProject(project: any): void {
    this.selectedProjectService.setSelectedProject(project);

    if (project.isInternal) {
      this.router.navigate([project.demoUrl]);
    } else {
      window.open(project.demoUrl, '_blank');
    }
  }
}
