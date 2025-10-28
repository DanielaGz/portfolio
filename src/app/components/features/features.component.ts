import { Component } from '@angular/core';
import { SelectedProjectService } from '../home/proyects/service/selected-project.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
  standalone: false
})
export class FeaturesComponent {

  selectedProject: any = null;

  constructor(
      private selectedProjectService: SelectedProjectService
    ) { 
      this.selectedProject = this.selectedProjectService.getSelectedProject();
    }

}
