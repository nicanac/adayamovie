import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavComponent } from './shared/components/nav/nav.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NavComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Sidebar Navigation -->
      <app-nav></app-nav>

      <!-- Main Content -->
      <div class="ml-64">
        <!-- Top Bar -->
        <div class="bg-white border-b px-8 py-4">
          <div class="flex items-center justify-end">
            <div class="flex items-center space-x-4">
              <button class="p-2 hover:bg-gray-100 rounded-full">
                <svg
                  class="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              @if (authService.isAuthenticated()) {
                <div class="relative">
                  <button
                    (click)="toggleUserMenu()"
                    class="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2"
                  >
                    <img
                      [src]="authService.getUserAvatar()"
                      alt="Profile"
                      class="h-8 w-8 rounded-full"
                    />
                    <span class="text-sm font-medium text-gray-700">
                      {{ authService.currentUser()?.username }}
                    </span>
                    <svg
                      class="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  @if (isUserMenuOpen()) {
                    <div
                      class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1"
                    >
                      <a
                        routerLink="/profile"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </a>
                      <a
                        routerLink="/preferences"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Preferences
                      </a>
                      <button
                        (click)="signOut()"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  }
                </div>
              } @else {
                <button
                  (click)="authService.login()"
                  class="text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2"
                >
                  Log in
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <main class="p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class AppComponent {
  public authService = inject(AuthService);
  isUserMenuOpen = signal(false);

  toggleUserMenu() {
    this.isUserMenuOpen.update((value) => !value);
  }

  signOut() {
    this.isUserMenuOpen.set(false);
    this.authService.logout();
  }
}
