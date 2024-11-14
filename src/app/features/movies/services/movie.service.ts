import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, map } from 'rxjs';
import { MovieData, MovieDetails } from '../../../shared/types/tmdb-movie.types';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = environment.tmdbApiKey;

  constructor(private http: HttpClient) {}

  getMovie(id: number): Observable<MovieData> {
    return this.http
      .get<MovieData>(`${this.baseUrl}/movie/${id}?api_key=${this.apiKey}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return throwError(() => new Error('Movie not found'));
          }
          return throwError(
            () => new Error('An error occurred while fetching movie data')
          );
        })
      );
  }

  getMovieDetails(movieId: number): Observable<MovieDetails> {
    return this.http
      .get<MovieDetails>(
        `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&append_to_response=credits,reviews,similar,videos`
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return throwError(() => new Error('Movie details not found'));
          }
          return throwError(
            () => new Error('An error occurred while fetching movie details')
          );
        })
      );
  }

  searchMovies(query: string): Observable<MovieData[]> {
    return this.http
      .get<{ results: MovieData[] }>(
        `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}`
      )
      .pipe(
        map((response) => response.results),
        catchError(() => throwError(() => new Error('Error searching movies')))
      );
  }

  getPopularMovies(): Observable<MovieData[]> {
    return this.http
      .get<{ results: MovieData[] }>(
        `${this.baseUrl}/movie/popular?api_key=${this.apiKey}`
      )
      .pipe(
        map((response) => response.results),
        catchError(() =>
          throwError(() => new Error('Error fetching popular movies'))
        )
      );
  }
}
