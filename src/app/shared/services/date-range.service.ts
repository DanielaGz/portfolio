import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type RangeType = 'week' | 'month' | 'year';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  rangeType: RangeType;
  referenceDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DateRangeService {
  private currentRangeSubject = new BehaviorSubject<DateRange>(this.getDefaultRange());
  
  currentRange$: Observable<DateRange> = this.currentRangeSubject.asObservable();

  constructor() {}

  private getDefaultRange(): DateRange {
    const today = new Date();
    return this.calculateRange('month', today);
  }

  setRangeType(rangeType: RangeType): void {
    const currentRange = this.currentRangeSubject.value;
    const newRange = this.calculateRange(rangeType, currentRange.referenceDate);
    this.currentRangeSubject.next(newRange);
  }

  setReferenceDate(date: Date): void {
    const currentRange = this.currentRangeSubject.value;
    const newRange = this.calculateRange(currentRange.rangeType, date);
    this.currentRangeSubject.next(newRange);
  }

  getCurrentRange(): DateRange {
    return this.currentRangeSubject.value;
  }

  private calculateRange(rangeType: RangeType, referenceDate: Date): DateRange {
    let startDate: Date;
    let endDate: Date;

    switch (rangeType) {
      case 'week':
        startDate = this.getStartOfWeek(referenceDate);
        endDate = this.getEndOfWeek(referenceDate);
        break;
      
      case 'month':
        startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
        endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59);
        break;
      
      case 'year':
        startDate = new Date(referenceDate.getFullYear(), 0, 1);
        endDate = new Date(referenceDate.getFullYear(), 11, 31, 23, 59, 59);
        break;
    }

    return {
      startDate,
      endDate,
      rangeType,
      referenceDate: new Date(referenceDate)
    };
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    const startOfWeek = new Date(d.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  private getEndOfWeek(date: Date): Date {
    const startOfWeek = this.getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  }

  navigatePrevious(): void {
    const currentRange = this.currentRangeSubject.value;
    let newDate: Date;

    switch (currentRange.rangeType) {
      case 'week':
        newDate = new Date(currentRange.referenceDate);
        newDate.setDate(newDate.getDate() - 7);
        break;
      
      case 'month':
        newDate = new Date(currentRange.referenceDate);
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      
      case 'year':
        newDate = new Date(currentRange.referenceDate);
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }

    this.setReferenceDate(newDate);
  }

  navigateNext(): void {
    const currentRange = this.currentRangeSubject.value;
    let newDate: Date;

    switch (currentRange.rangeType) {
      case 'week':
        newDate = new Date(currentRange.referenceDate);
        newDate.setDate(newDate.getDate() + 7);
        break;
      
      case 'month':
        newDate = new Date(currentRange.referenceDate);
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      
      case 'year':
        newDate = new Date(currentRange.referenceDate);
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }

    this.setReferenceDate(newDate);
  }
}
