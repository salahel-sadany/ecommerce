import { Component, inject, output, signal } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { ViewPanel } from '../../../../directives/view-panel';
import { MatAnchor } from '@angular/material/button';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-form',
  imports: [
    MatFormField,
    MatInput,
    ViewPanel,
    MatAnchor,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
  ],
  templateUrl: './review-form.html',
  styleUrl: './review-form.scss',
})
export class ReviewForm {
  protected readonly selectRateOptions = signal([
    {
      value: '5',
      viewValue: '5 Stars - Excellent',
    },
    {
      value: '4',
      viewValue: '4 Stars - Good',
    },
    {
      value: '3',
      viewValue: '3 Stars - Average',
    },
    {
      value: '2',
      viewValue: '2 Stars - Poor',
    },
    {
      value: '1',
      viewValue: '1 Stars - Terrible',
    },
  ]);
  protected readonly reviewFormClosed = output();

  protected readonly fb = inject(NonNullableFormBuilder);

  reviewForm = this.fb.group({
    reviewTitle: ['', Validators.required],
    rate: [this.selectRateOptions()[0].value, Validators.required],
    review: ['', Validators.required],
  });

  onSubmit() {
    if (!this.reviewForm.valid) {
      this.reviewForm.markAllAsTouched();
      return;
    }
  }
}
