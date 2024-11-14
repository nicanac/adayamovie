import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="fixed left-0 top-0 h-full w-64 bg-[#6366F1] text-white p-4">
      <div class="flex flex-col h-full">
        <div class="mb-8">
          <img src="assets/logo.svg" alt="Logo" class="h-8 w-8" />
        </div>

        <div class="space-y-4 flex-grow">
          <a
            routerLink="/pokemon"
            routerLinkActive="bg-white/20"
            class="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/10"
          >
            <span class="material-icons">catching_pokemon</span>
            <span>Pokemon</span>
          </a>
          <a
            routerLink="/movies"
            routerLinkActive="bg-white/20"
            class="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/10"
          >
            <span class="material-icons">movie</span>
            <span>Movies</span>
          </a>
        </div>

        <!-- User Profile Section -->
        <div class="mt-auto">
          @if (isAuthenticated()) {
          <div class="relative">
            <button
              (click)="toggleUserMenu()"
              class="w-full flex items-center px-4 py-2 rounded-lg hover:bg-white/10"
            >
              <div
                class="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3"
              >
                <span class="text-sm font-medium">{{ getUserInitials() }}</span>
              </div>
              <span class="flex-grow text-left">{{ userName() }}</span>
              <span class="material-icons text-sm">
                {{ isUserMenuOpen() ? 'expand_less' : 'expand_more' }}
              </span>
            </button>

            @if (isUserMenuOpen()) {
            <div
              class="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <a
                routerLink="/profile"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <span class="material-icons text-sm mr-2">person</span>
                Profile
              </a>
              <a
                routerLink="/preferences"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <span class="material-icons text-sm mr-2">settings</span>
                Preferences
              </a>
              <button
                (click)="signOut()"
                class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                <span class="material-icons text-sm mr-2">logout</span>
                Sign out
              </button>
            </div>
            }
          </div>
          } @else {
          <a
            routerLink="/login"
            class="flex items-center px-4 py-2 rounded-lg hover:bg-white/10"
          >
            <span class="material-icons mr-3">login</span>
            <span>Log in</span>
          </a>
          }
        </div>
      </div>
    </nav>
  `,
})
export class NavComponent {
  isUserMenuOpen = signal(false);
  isAuthenticated = signal(false); // Replace with actual auth service
  userName = signal('John Doe'); // Replace with actual user name

  toggleUserMenu() {
    this.isUserMenuOpen.update((value) => !value);
  }

  getUserInitials(): string {
    return this.userName()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  signOut() {
    this.isAuthenticated.set(false);
    this.isUserMenuOpen.set(false);
    // Add your signout logic here
  }
}
