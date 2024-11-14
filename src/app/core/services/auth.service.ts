import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError, map } from 'rxjs';
import { environment } from '../../../environments/environment';

interface TMDBSession {
  success: boolean;
  session_id: string;
  expires_at?: string;
}

interface TMDBRequestToken {
  success: boolean;
  expires_at: string;
  request_token: string;
}

interface MovieData {
  id: number;
  title: string;
  // Add any other necessary properties here
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  isAuthenticated = signal(false);
  currentUser = signal<any>(null);

  constructor(private http: HttpClient) {
    this.checkExistingSession();
  }

  private checkExistingSession() {
    const sessionId = localStorage.getItem('tmdb_session_id');
    if (sessionId) {
      this.isAuthenticated.set(true);
      this.loadUserDetails(sessionId);
    }
  }

  login(): Observable<TMDBRequestToken> {
    return this.http
      .get<TMDBRequestToken>(
        `${this.baseUrl}/authentication/token/new?api_key=${environment.tmdbApiKey}`
      )
      .pipe(
        tap((response) => {
          if (response.success) {
            window.location.href = `https://www.themoviedb.org/authenticate/${response.request_token}?redirect_to=${window.location.origin}/auth/callback`;
          }
        })
      );
  }

  createSession(requestToken: string): Observable<TMDBSession> {
    return this.http
      .post<TMDBSession>(
        `${this.baseUrl}/authentication/session/new?api_key=${environment.tmdbApiKey}`,
        { request_token: requestToken }
      )
      .pipe(
        tap((response) => {
          if (response.success) {
            localStorage.setItem('tmdb_session_id', response.session_id);
            this.isAuthenticated.set(true);
            this.loadUserDetails(response.session_id);
          }
        })
      );
  }

  private loadUserDetails(sessionId: string) {
    this.http
      .get(
        `${this.baseUrl}/account?api_key=${environment.tmdbApiKey}&session_id=${sessionId}`
      )
      .subscribe((user) => {
        this.currentUser.set(user);
      });
  }

  logout() {
    const sessionId = localStorage.getItem('tmdb_session_id');
    if (sessionId) {
      this.http
        .delete(
          `${this.baseUrl}/authentication/session?api_key=${environment.tmdbApiKey}`,
          { body: { session_id: sessionId } }
        )
        .subscribe();
    }
    localStorage.removeItem('tmdb_session_id');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }

  addToFavorites(movieId: number): Observable<any> {
    const sessionId = localStorage.getItem('tmdb_session_id');
    if (!sessionId || !this.currentUser()) return throwError(() => new Error('Not authenticated'));

    return this.http.post(
      `${this.baseUrl}/account/${this.currentUser().id}/favorite?api_key=${environment.tmdbApiKey}&session_id=${sessionId}`,
      {
        media_type: 'movie',
        media_id: movieId,
        favorite: true
      }
    );
  }

  removeFromFavorites(movieId: number): Observable<any> {
    const sessionId = localStorage.getItem('tmdb_session_id');
    if (!sessionId || !this.currentUser()) return throwError(() => new Error('Not authenticated'));

    return this.http.post(
      `${this.baseUrl}/account/${this.currentUser().id}/favorite?api_key=${environment.tmdbApiKey}&session_id=${sessionId}`,
      {
        media_type: 'movie',
        media_id: movieId,
        favorite: false
      }
    );
  }

  getFavoriteMovies(): Observable<MovieData[]> {
    const sessionId = localStorage.getItem('tmdb_session_id');
    if (!sessionId || !this.currentUser()) return throwError(() => new Error('Not authenticated'));

    return this.http.get<{ results: MovieData[] }>(
      `${this.baseUrl}/account/${this.currentUser().id}/favorite/movies?api_key=${environment.tmdbApiKey}&session_id=${sessionId}`
    ).pipe(
      map(response => response.results)
    );
  }
}
