import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatAnchor, MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose } from '@angular/material/dialog';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatPrefix, MatSuffix, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { UserSignIn } from '../../../models/user.model';
import { AuthStore } from '../../store/auth.store';
import { DialogRef } from '@angular/cdk/dialog';
import { SignUpDialog } from '../sign-up-dialog/sign-up-dialog';

@Component({
  selector: 'app-sign-in-dialog',
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
    MatError,
  ],
  templateUrl: './sign-in-dialog.html',
  styleUrl: './sign-in-dialog.scss',
})
export class SignInDialog {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(AuthStore);
  protected readonly dialog = inject(MatDialog);
  private readonly dialogData = inject<{ checkout: boolean }>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(DialogRef);

  protected readonly passwordVisible = signal(false);

  protected readonly signInForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required],
  });

  protected signIn() {
    if (!this.signInForm.valid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.signInForm.value;

    this.store.signIn({
      email,
      password,
      checkout: this.dialogData?.checkout,
      dialogId: this.dialogRef.id,
    } as UserSignIn);
  }

  protected openSignUpDialog() {
    this.dialogRef.close();

    this.dialog.open(SignUpDialog, {
      disableClose: true,
      data: {
        checkout: this.dialogData?.checkout,
      },
    });
  }
}
