import {
  Component,
  signal,
  inject,
  effect,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MovieData } from '../../../../shared/types/movie-data.type';
import { MovieService } from '../../services/movie.service';
import { StreamingService } from '../../services/streaming.service';
import { StreamingProvider } from '../../../../shared/types/streaming.types';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  animate,
  style,
  transition,
  trigger,
  query,
  stagger,
} from '@angular/animations';
import { SafePipe } from '../../../../shared/pipes/safe.pipe';
import { AuthService } from '../../../../core/services/auth.service';
import { WatchedButtonComponent } from '../watched-button/watched-button.component';

interface ProvidersByType {
  flatrate: StreamingProvider[];
  free: StreamingProvider[];
  buy: StreamingProvider[];
  rent: StreamingProvider[];
}

interface MovieVideo {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

@Component({
  selector: 'app-movie-card',
  standalone: true,
  providers: [CommonModule, SafePipe],
  animations: [
    trigger('cardContent', [
      transition(':enter', [
        query(
          '.animate-item',
          [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            stagger(50, [
              animate(
                '300ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],

  templateUrl: './movie-card.component.html',
  imports: [CommonModule, SafePipe, WatchedButtonComponent],
})
export class MovieCardComponent {
  @Input({ required: true }) movieId!: number;
  @Output() close = new EventEmitter<void>();

  movie = signal<MovieData | null>(null);
  providers = signal<ProvidersByType>({
    flatrate: [],
    free: [],
    buy: [],
    rent: [],
  });

  constructor(
    private movieService: MovieService,
    private streamingService: StreamingService
  ) {}

  ngOnInit() {
    this.loadMovieDetails();
  }

  private loadMovieDetails() {
    forkJoin({
      movieDetails: this.movieService.getMovieDetails(this.movieId),
      providers: this.streamingService.getMovieAvailability(this.movieId),
    }).subscribe({
      next: ({ movieDetails, providers }) => {
        this.movie.set(movieDetails as MovieData);
        this.providers.set({
          flatrate: providers?.results?.['BE']?.flatrate || [],
          free: providers?.results?.['BE']?.free || [],
          buy: providers?.results?.['BE']?.buy || [],
          rent: providers?.results?.['BE']?.rent || [],
        });
      },
      error: (error) => console.error('Error loading movie details:', error),
    });
  }

  public getOfficialTrailer(movie: MovieData): MovieVideo | null {
    if (!movie.videos?.results) return null;

    // First try to find the official trailer
    const officialTrailer = movie.videos.results.find(
      (video: { type: string; official: any; site: string }) =>
        video.type === 'Trailer' && video.official && video.site === 'YouTube'
    );

    // If no official trailer, get any trailer
    if (!officialTrailer) {
      return (
        movie.videos.results.find(
          (video: { type: string; site: string }) =>
            video.type === 'Trailer' && video.site === 'YouTube'
        ) || null
      );
    }

    return officialTrailer;
  }

  public getYouTubeEmbedUrl(key: string): string {
    return `https://www.youtube.com/embed/${key}`;
  }
}
