import { Component, Input, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchedMoviesService } from '../../services/watched-movie.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-watched-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleWatched()"
      [disabled]="!authService.isAuthenticated()"
      class="flex items-center space-x-2 px-4 py-2 rounded-full transition-colors"
      [class.bg-green-500]="isWatched()"
      [class.text-white]="isWatched()"
      [class.bg-gray-100]="!isWatched()"
      [class.hover:bg-gray-200]="!isWatched()"
    >
      <span class="material-icons text-sm">
        {{ isWatched() ? 'check_circle' : 'radio_button_unchecked' }}
      </span>
      <span>{{ isWatched() ? 'Watched' : 'Mark as watched' }}</span>
    </button>
  `
})
export class WatchedButtonComponent {
  @Input({ required: true }) movieId!: number;

  private watchedMoviesService = inject(WatchedMoviesService);
  public authService = inject(AuthService);

  isWatched = signal(false);

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.checkWatchedStatus();
      }
    });
  }

  toggleWatched() {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    const sessionId = this.authService.getSessionId();
    if (!sessionId) return;

    if (this.isWatched()) {
      this.watchedMoviesService
        .removeFromWatched(this.movieId, sessionId)
        .subscribe({
          next: () => this.isWatched.set(false),
          error: (error) => console.error('Error removing from watched:', error),
        });
    } else {
      this.watchedMoviesService
        .markAsWatched(this.movieId, sessionId)
        .subscribe({
          next: () => this.isWatched.set(true),
          error: (error) => console.error('Error marking as watched:', error),
        });
    }
  }

  private checkWatchedStatus() {
    const sessionId = this.authService.getSessionId();
    if (!sessionId) return;

    this.watchedMoviesService.getWatchedMovies(sessionId).subscribe({
      next: (response) => {
        const isWatched = response.some(
          (movie: any) => movie.id === this.movieId
        );
        this.isWatched.set(isWatched);
      },
      error: (error) => console.error('Error checking watched status:', error),
    });
  }
}