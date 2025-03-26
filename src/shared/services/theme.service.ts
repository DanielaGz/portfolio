import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private lightTheme = {
    '--primary': '#469db7',  /* Azul ligeramente más oscuro */
    '--secondary': '#6ec1c3', /* Azul más natural */
    '--tertiary': '#a9f2d8',  /* Verde-menta más balanceado */
    '--accent': '#337889',    /* Azul más profundo para destacar */
    '--neutral': '#d9efec',   /* Gris claro con tinte verdeazulado */
    '--neutral-bg': '#f5f7fa',/* Blanco con leve azul para menos fatiga visual */
    '--gradient-bg': 'radial-gradient(circle, rgba(220,150,190,1) 0%, rgba(135,170,220,1) 100%)',
    '--text-color': '#1a1a1a' /* Negro suave para buen contraste */
};
private darkTheme = {
  '--primary': '#2a5d72',  /* Azul petróleo más profundo */
  '--secondary': '#4c8a8e', /* Verde azulado más neutro */
  '--tertiary': '#79b9a8',  /* Verde agua menos saturado */
  '--accent': '#224d5c',    /* Azul oscuro con mejor contraste */
  '--neutral': '#a8c6c3',   /* Gris claro con tono verdoso */
  '--neutral-bg': '#24282f',/* Gris casi negro con leve azul */
  '--gradient-bg': 'radial-gradient(circle, rgba(70, 24, 90, 1) 0%, rgba(18, 35, 60, 1) 100%)',
  '--text-color': '#ffffff' /* Blanco puro para alto contraste */
};


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
  }

  toggleTheme() {
    const currentTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    this.setTheme(currentTheme);
  }

  getCurrentTheme(): 'light' | 'dark' {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  }
}
