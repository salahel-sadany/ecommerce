import { Directive } from '@angular/core';

@Directive({
  selector: '[appViewPanel]',
  host: {
    class: 'mat-bg-surface mat-border-subtle rounded-xl p-6',
  },
})
export class ViewPanel {
  constructor() {}
}
