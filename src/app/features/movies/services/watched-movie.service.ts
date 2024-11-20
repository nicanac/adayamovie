// src/app/features/movies/services/watched-movies.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class WatchedMoviesService {
  private authService = inject(AuthService);

  constructor(private http: HttpClient) {}

  markAsWatched(movieId: number, sessionId: string): Observable<any> {
    return this.authService.markAsWatched(movieId);
  }

  removeFromWatched(movieId: number, sessionId: string): Observable<any> {
    return this.authService.removeFromWatched(movieId);
  }

  getWatchedMovies(sessionId: string): Observable<any> {
    return this.authService.getWatchedMovies();
  }
}
