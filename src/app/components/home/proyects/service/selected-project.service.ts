import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedProjectService {
  private selectedProjectSubject = new BehaviorSubject<any>(null);
  public selectedProject$: Observable<any> = this.selectedProjectSubject.asObservable();

  setSelectedProject(project: any): void {
    this.selectedProjectSubject.next(project);
  }

  getSelectedProject(): any {
    return this.selectedProjectSubject.getValue();
  }
}
