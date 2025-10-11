import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UrlShortenerComponent } from './url-shortener/url-shortener.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ShortenerService } from './url-shortener/service/url_shortener.service';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';


const routes: Routes = [
  {
      path: 'url_shortener',
      component: UrlShortenerComponent
  }
];


@NgModule({
  declarations: [UrlShortenerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    RouterModule
  ],
  providers:[
    ShortenerService
  ]
})
export class FeaturesModule { }
