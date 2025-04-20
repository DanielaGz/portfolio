import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private lightTheme = {
    '--primary': '#F9EDEC',  /* Azul ligeramente más oscuro */
    '--secondary': '#F1EBF3', /* Azul más natural */
    '--tertiary': '#EBEDE2',  /* Verde-menta más balanceado */
    '--accent': '#337889',    /* Azul más profundo para destacar */
    '--neutral': '#fdf6f3',   /* Gris claro con tinte verdeazulado */
    '--neutral-bg': '#FDF6F3',/* Blanco con leve azul para menos fatiga visual */
    '--gradient-bg': 'radial-gradient(circle, rgba(220,150,190,1) 0%, rgba(135,170,220,1) 100%)',
    '--text-color': '#5E5F62', /* Negro suave para buen contraste */
    '--text-primary': '#DF9490',
    '--text-background-card': 'white'
};
private darkTheme = {
  '--primary': '#2E1B2C',       // Profundo ciruela (versión oscura de #F9EDEC)
  '--secondary': '#2B2233',     // Lila oscuro apagado (para fondo alternativo)
  '--tertiary': '#3B3A32',      // Gris oliva oscuro (suave y no negro puro)
  '--accent': '#88C9D2',        // Azul celeste tenue para acentos y enlaces
  '--neutral': '#B8B2AE',       // Gris claro para íconos o texto secundario
  '--neutral-bg': '#18181B',    // Fondo base general, casi negro
  '--gradient-bg': 'radial-gradient(circle, rgba(60,20,50,1) 0%, rgba(20,30,40,1) 100%)',
  '--text-color': '#E4E4E4',    // Blanco grisáceo para el texto principal
  '--text-primary': '#DF9490',  // Conservado para coherencia (resalta bien)
  '--text-background-card': '#1F1F23' // Para tarjetas, fondo intermedio
};
private themeSubject = new BehaviorSubject<'light' | 'dark'>(this.getCurrentTheme());
theme$ = this.themeSubject.asObservable()


  constructor() {
    // Comprobar si el usuario tiene un tema guardado en localStorage
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    this.setTheme(savedTheme);
  }

  setTheme(theme: 'light' | 'dark') {
    const themeVariables: { [key: string]: string } = theme === 'dark' ? this.darkTheme : this.lightTheme;

    Object.keys(themeVariables).forEach((key) => {
      document.documentElement.style.setProperty(key, themeVariables[key]);
    });

    localStorage.setItem('theme', theme);
    this.themeSubject.next(theme);
  }

  toggleTheme() {
    const currentTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    this.setTheme(currentTheme);
  }

  getCurrentTheme(): 'light' | 'dark' {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  }
}
