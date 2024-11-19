import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  isNavOpen = signal(true);

  toggleNav() {
    this.isNavOpen.update((value) => !value);
  }
}
