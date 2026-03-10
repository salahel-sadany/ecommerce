import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatAnchor, MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose } from '@angular/material/dialog';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { UserSignUp } from '../../../models/user.model';
import { DialogRef } from '@angular/cdk/dialog';
import { AuthStore } from '../../store/auth.store';
import { SignInDialog } from '../sign-in-dialog/sign-in-dialog';

@Component({
  selector: 'app-sign-up-dialog',
  imports: [
    MatIcon,
    MatIconButton,
    MatDialogClose,
    MatFormField,
    MatInput,
    MatPrefix,
    MatSuffix,
    MatAnchor,
    MatButton,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-up-dialog.html',
  styleUrl: './sign-up-dialog.scss',
})
export class SignUpDialog {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(AuthStore);
  protected readonly dialog = inject(MatDialog);
  private readonly dialogData = inject<{ checkout: boolean }>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(DialogRef);

  protected readonly signUpForm = this.fb.group({
    name: ['John Doe', [Validators.required]],
    email: ['salah@test.com', [Validators.email, Validators.required]],
    password: ['1234', Validators.required],
    confirmPassword: ['1234', Validators.required],
  });

  protected readonly passwordVisible = signal(false);

  protected signUp() {
    if (!this.signUpForm.valid) return;

    const { name, email, password } = this.signUpForm.value;

    this.store.signUp({
      name,
      email,
      password,
      checkout: this.dialogData?.checkout,
      dialogId: this.dialogRef.id,
    } as UserSignUp);
  }

  protected openSignInDialog() {
    this.dialogRef.close();

    this.dialog.open(SignInDialog, {
      disableClose: true,
      data: {
        checkout: this.dialogData?.checkout,
      },
    });
  }
}
