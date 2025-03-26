import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModules } from '../../app.imports';
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'navbar',
  imports: [...MaterialModules],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  title = 'navbar';

  currentTheme: 'light' | 'dark';

  constructor(private themeService: ThemeService) {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.getCurrentTheme();
  }
}
