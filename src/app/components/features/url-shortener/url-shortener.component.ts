import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortenerService } from './service/url_shortener.service';

@Component({
  selector: 'app-url-shortener',
  templateUrl: './url-shortener.component.html',
  styleUrl: './url-shortener.component.scss',
  standalone: false
})
export class UrlShortenerComponent {
  urlForm!: FormGroup;
  url_shorter: string | null = null;
  copied = false;

  constructor(
    private fb: FormBuilder,
    private shortenerService: ShortenerService
  ) { }

  ngOnInit(): void {
    this.urlForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }



  onSubmit(): void {
    const originalUrl = this.urlForm.value.url;
    console.log(originalUrl);

    this.shortenerService.shortenUrl(originalUrl).subscribe({
      next: (response) => {
        console.log('URL corta generada:', response.short_url);
        this.url_shorter = response.short_url;
      },
      error: (err) => {
        console.error('Error al acortar URL', err);
      },
    });
  }

  copyToClipboard(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }

}
