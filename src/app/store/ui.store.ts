import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalMethod, signalStore, withMethods, withState } from '@ngrx/signals';

export interface UISlice {
  readonly isSidenavOpen: boolean;
  readonly searchWord: string;
}

export const initialUISlice: UISlice = {
  isSidenavOpen: false,
  searchWord: '',
};

export const UIStore = signalStore(
  { providedIn: 'root' },
  withState(initialUISlice),
  withMethods((store) => ({
    toggleSidenav: () =>
      updateState(store, 'Sidenav toggled', (state) => ({ isSidenavOpen: !state.isSidenavOpen })),
    closeSidenav: () => updateState(store, 'sidenav closed', { isSidenavOpen: false }),
    setSearchWord: signalMethod((word: string) =>
      updateState(store, 'Search Word update', { searchWord: word || '' }),
    ),
  })),

  withDevtools('ui-store'),
);
