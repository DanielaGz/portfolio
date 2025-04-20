import { Component } from '@angular/core';
import { MaterialModules } from '../../app.imports';

@Component({
  selector: 'app-footer',
  imports: [...MaterialModules],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
