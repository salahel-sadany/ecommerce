import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const formGroup = control as FormGroup;
  const passwordControl = formGroup.get('password');
  const confirmPasswordControl = formGroup.get('confirmPassword');

  if (
    !passwordControl ||
    !confirmPasswordControl ||
    passwordControl.value === confirmPasswordControl.value
  )
    return null;

  confirmPasswordControl.setErrors({ mismatch: true });
  return { mismatch: true };
}
