import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-movie-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Movies</h1>
      </div>
      <nav class="mb-8 border-b border-gray-200">
        <ul class="flex -mb-px">
          <li class="mr-1">
            <a
              routerLink="by-title"
              routerLinkActive="border-blue-500 text-blue-600"
              class="inline-block px-6 py-3 text-gray-600 hover:text-gray-800 border-b-2 border-transparent font-medium transition-colors"
            >
              Search by Title
            </a>
          </li>
          <li class="mr-1">
            <a
              routerLink="by-filter"
              routerLinkActive="border-blue-500 text-blue-600"
              class="inline-block px-6 py-3 text-gray-600 hover:text-gray-800 border-b-2 border-transparent font-medium transition-colors"
            >
              Search by Filters
            </a>
          </li>
        </ul>
      </nav>
      <div class="bg-white rounded-lg shadow-sm p-6">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class MoviePageComponent {}
