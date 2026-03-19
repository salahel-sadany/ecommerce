import { inject, Injectable } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { HotToastService } from '@ngxpert/hot-toast';
import { pipe, tap, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  private readonly toast = inject(HotToastService);

  readonly share = rxMethod<{ title: string; text: string; url: string }>(
    pipe(
      tap(({ title, text, url }) => {
        if (navigator.share) {
          from(navigator.share({ title, text, url })).subscribe();
        } else {
          from(navigator.clipboard.writeText(url))
            .pipe(tap(() => this.toast.success('Link copied!')))
            .subscribe();
        }
      }),
    ),
  );
}
