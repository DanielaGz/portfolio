import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(this.getCurrentTheme());
  theme$ = this.themeSubject.asObservable();

  constructor() {
    // aplica el tema inicial al cargar
    this.applyTheme(this.getCurrentTheme());
  }

  toggleTheme(): void {
    const newTheme: Theme = this.getCurrentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
    this.themeSubject.next(theme);
  }

  getCurrentTheme(): Theme {
    return (localStorage.getItem('theme') as Theme) || 'light';
  }

  /** Pone/elimina el atributo data‑theme en <html> */
  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
