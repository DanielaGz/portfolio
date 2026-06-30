import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly points = [1, 2, 3, 4, 5];

  readonly skills = [
    { name: 'TypeScript', level: 90, icon: 'code', asset: 'typescript.svg', desc: 'Lenguaje tipado para aplicaciones front y back, mejora la mantenibilidad.' },
    { name: 'Angular', level: 90, icon: 'change_history', asset: 'angular.svg', desc: 'Framework principal para desarrollo SPA con 3+ años de experiencia.' },
    { name: 'HTML & CSS', level: 90, icon: 'web', asset: 'html-css.svg', desc: 'Estructura y estilos con 4 años de experiencia en interfaces responsivas.' },
    { name: 'JavaScript', level: 90, icon: 'javascript', asset: 'javascript.svg', desc: 'Lenguaje principal del navegador con 4 años de experiencia.' },
    { name: 'Git', level: 90, icon: 'commit', asset: 'git.svg', desc: 'Control de versiones con 4 años en colaboración de equipos.' },
    { name: 'Firebase', level: 40, icon: 'cloud', asset: 'firebase.svg', desc: 'Servicios en la nube para autenticación, base de datos y hosting.' },
    { name: 'Python', level: 90, icon: 'python', asset: 'python.svg', desc: 'Lenguaje versátil con 3+ años en backend y scripts.' },
    { name: 'SQL', level: 70, icon: 'storage', asset: 'sql.svg', desc: 'Consultas en bases de datos con 3+ años de experiencia.' },
    { name: 'MongoDB', level: 80, icon: 'storage', asset: 'mongodb.svg', desc: 'Base de datos NoSQL con experiencia en aplicaciones con 3+ años.' },
    { name: 'Jira', level: 85, icon: 'task', asset: 'jira.svg', desc: 'Gestión de proyectos ágiles con 4 años de experiencia.' },
    { name: 'Auth0 / SSO', level: 80, icon: 'security', asset: 'auth0.svg', desc: 'Autenticación y gestión de identidades con 3+ años.' },
    { name: 'FastAPI', level: 75, icon: 'bolt', asset: 'fastapi.svg', desc: 'Framework para APIs rápidas y escalables con Python.' },
    { name: 'NestJS', level: 60, icon: 'nestjs', asset: 'nestjs.svg', desc: 'Framework backend progresivo con arquitectura modular.' },
    { name: 'AWS', level: 65, icon: 'cloud', asset: 'aws.svg', desc: 'Servicios en la nube básicos de Amazon Web Services.' },
  ].sort((a, b) => b.level - a.level);

  getCategory(level: number): string {
    if (level >= 85) return 'Avanzado';
    if (level >= 70) return 'Intermedio';
    if (level >= 40) return 'En aprendizaje';
    return 'Básico';
  }

  getCategoryColor(level: number): string {
    if (level >= 85) return 'var(--cat-advanced)';
    if (level >= 70) return 'var(--cat-intermediate)';
    if (level >= 40) return 'var(--cat-learning)';
    return 'var(--cat-basic)';
  }

  getBarGradient(level: number): string {
    if (level >= 85) return 'linear-gradient(90deg, var(--cat-advanced), var(--cat-advanced-2))';
    if (level >= 70) return 'linear-gradient(90deg, var(--cat-intermediate), var(--cat-intermediate-2))';
    if (level >= 40) return 'linear-gradient(90deg, var(--cat-learning), var(--cat-learning-2))';
    return 'linear-gradient(90deg, var(--cat-basic), var(--cat-basic-2))';
  }

  getCategoryTextColor(level: number): string {
    if (level >= 85) return 'var(--cat-advanced-on)';
    if (level >= 70) return 'var(--cat-intermediate-on)';
    if (level >= 40) return 'var(--cat-learning-on)';
    return 'var(--cat-basic-on)';
  }
}
