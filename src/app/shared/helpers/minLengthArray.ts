import { AbstractControl, ValidationErrors, FormArray } from '@angular/forms';

export function minLengthArray(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray) {
      return control.length >= min ? null : { required: true };
    }
    return null;
  };
}
