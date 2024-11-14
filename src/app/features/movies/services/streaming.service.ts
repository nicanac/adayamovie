import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  StreamingProvider,
  MovieAvailability,
} from '../../../shared/types/streaming.types';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StreamingService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = environment.tmdbApiKey;
  private readonly country = 'BE'; // Make this configurable later

  constructor(private http: HttpClient) {}

  getStreamingProviders(): Observable<StreamingProvider[]> {
    return this.http
      .get<{ results: StreamingProvider[] }>(
        `${this.baseUrl}/watch/providers/movie?api_key=${this.apiKey}&watch_region=${this.country}`
      )
      .pipe(map((response) => response.results));
  }

  getMovieAvailability(movieId: number): Observable<MovieAvailability> {
    return this.http.get<MovieAvailability>(
      `${this.baseUrl}/movie/${movieId}/watch/providers?api_key=${this.apiKey}`
    );
  }
}
