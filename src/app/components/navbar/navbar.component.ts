import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModules } from '../../app.imports';

@Component({
  selector: 'navbar',
  imports: [RouterOutlet, ...MaterialModules],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  title = 'navbar';
}
