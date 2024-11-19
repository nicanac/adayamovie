import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, map, forkJoin } from 'rxjs';
import {
  MovieData,
  MovieDetails,
} from '../../../shared/types/tmdb-movie.types';
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
      .get<MovieData>(
        `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&append_to_response=videos`
      )
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

  searchMovies(query: string, providers?: number[]): Observable<MovieData[]> {
    let url = `${this.baseUrl}/search/movie?api_key=${
      this.apiKey
    }&query=${encodeURIComponent(query)}`;

    let country: string = 'BE';
    if (providers && providers.length > 0) {
      url += `&watch_region=${country}&with_watch_providers=${providers.join(
        '|'
      )}`;
    }

    const pages = [1, 2, 3, 4, 5];
    const pageRequests = pages.map((page) =>
      this.http
        .get<{ results: MovieData[] }>(`${url}&page=${page}`)
        .pipe(map((response) => response.results))
    );

    return forkJoin(pageRequests).pipe(
      map((pagesResults) => {
        const allResults = pagesResults.flat();
        console.log(
          'Before sorting:',
          allResults.map((m) => ({ title: m.title, vote_count: m.vote_count }))
        );

        const sortedResults = allResults.sort((a, b) => {
          console.log(
            `Comparing ${a.title}(${a.vote_count}) with ${b.title}(${b.vote_count})`
          );
          return (b.vote_count || 0) - (a.vote_count || 0); // Handle null/undefined vote_counts
        });

        console.log(
          'After sorting:',
          sortedResults.map((m) => ({
            title: m.title,
            vote_count: m.vote_count,
          }))
        );
        return sortedResults;
      }),
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

  discoverMovies(params: any): Observable<MovieData[]> {
    const searchParams = {
      api_key: this.apiKey,
      watch_region: 'BE',
      with_watch_providers: 'netflix',
      sort_by: 'popularity.desc',
      ...params,
    };

    const pages = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26,
    ];
    const pageRequests = pages.map((page) =>
      this.http
        .get<{ results: MovieData[] }>(`${this.baseUrl}/discover/movie`, {
          params: { ...searchParams, page },
        })
        .pipe(map((response) => response.results))
    );

    return forkJoin(pageRequests).pipe(
      map((pagesResults) => {
        const allResults = pagesResults.flat();
        console.log(
          'Before sorting:',
          allResults.map((m) => ({ title: m.title, vote_count: m.vote_count }))
        );

        const sortedResults = allResults.sort((a, b) => {
          console.log(
            `Comparing ${a.title}(${a.vote_count}) with ${b.title}(${b.vote_count})`
          );
          return (b.vote_count || 0) - (a.vote_count || 0);
        });1436
        

        console.log(
          'After sorting:',
          sortedResults.map((m) => ({
            title: m.title,
            vote_count: m.vote_count,
          }))
        );
        return sortedResults;
      }),
      catchError(() => throwError(() => new Error('Error discovering movies')))
    );
  }
}
