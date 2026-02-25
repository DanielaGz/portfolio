import { Component } from '@angular/core';
import { ThemeService } from '../../../../shared/services/theme.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrl: './init.component.scss',
  standalone: false
})
export class InitComponent {
  currentTheme = 'light';

  constructor(private themeService: ThemeService) {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = this.themeService.getCurrentTheme();
    });
    
  }

  goToProjects(): void {
    const projectsTitle = document.getElementById('projects-title');
    if (!projectsTitle) {
      return;
    }

    const navbar = document.querySelector('mat-toolbar.navbar-header') as HTMLElement | null;
    const offset = (navbar?.offsetHeight ?? 0) + 16;
    const top = projectsTitle.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  }
}
