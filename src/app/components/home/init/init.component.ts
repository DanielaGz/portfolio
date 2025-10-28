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
}
