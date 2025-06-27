import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  getErrorMessage(control: AbstractControl): string | null {
    if (control?.hasError('required')) {
      return 'este campo es obligatorio';
    }

    if (control?.hasError('email')) {
      return 'Debe ser una dirección de correo electrónico válida.';
    }

    if (control?.hasError('minlength')) {
      const requiredLength = control.getError('minlength')?.requiredLength;
      return `Debe tener al menos ${requiredLength} caracteres.`;
    }

    if (control?.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength')?.requiredLength;
      return `Debe tener como máximo ${requiredLength} caracteres.`;
    }

    if (control?.hasError('pattern')) {
      return 'El formato no es válido.';
    }
    return null;
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && control.touched;
  }
}
