import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamingSelectorComponent } from '../streaming/streaming-selector/streaming-selector.component';
import { RatingSelectorComponent } from '../rating-selector/rating-selector.component';
import { MovieDiscoverStore } from '../../stores/movie-discover.store';
import { MovieSearchResultsComponent } from '../movie-search-results/movie-search-results.component';
import { StreamingProviderStore } from '../../stores/streaming-provider.store';

@Component({
  selector: 'app-movie-filter',
  standalone: true,
  imports: [
    CommonModule,
    StreamingSelectorComponent,
    RatingSelectorComponent,
    MovieSearchResultsComponent,
  ],
  template: `
    <div class="relative w-full">
      <div class="relative">
        <div class="relative flex items-center gap-4">
          <app-rating-selector
            (ratingChanged)="discoverStore.setRatingThreshold($event)"
          />
          <app-streaming-selector
            (providersChanged)="onProvidersChanged($event)"
          />
          <button
            (click)="search()"
            class="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Search Movies
          </button>
        </div>

        @if (discoverStore.error()) {
        <p class="text-red-500 text-sm mt-2">{{ discoverStore.error() }}</p>
        } @if (discoverStore.movies().length > 0) {
        <app-movie-search-results [movies]="discoverStore.movies()" />
        }
      </div>
    </div>
  `,
})
export class MovieFilterComponent {
  constructor(
    protected discoverStore: MovieDiscoverStore,
    private streamingProviderStore: StreamingProviderStore
  ) {}

  ngOnInit() {
    this.discoverStore.clearResults();
  }

  onProvidersChanged(providers: number[]) {
    this.streamingProviderStore.updateSelectedProviders(providers);
    this.discoverStore.discoverMovies();
  }

  search() {
    this.discoverStore.discoverMovies();
  }
}
