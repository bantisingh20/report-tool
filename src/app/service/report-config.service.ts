import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
 


@Injectable({
  providedIn: 'root'
})
export class ReportConfigService {
  
    
 minSelectedCheckboxes(min: number = 1) {
  return function (control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (Array.isArray(value) && value.length >= min) {
      return null;
    }
    return { minSelected: true };
  };
}
}
