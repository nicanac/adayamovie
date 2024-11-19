import { Routes } from '@angular/router';
import { MoviePageComponent } from './movie-page.component';
import { MovieSearchComponent } from '../../features/movies/components/movie-search/movie-search.component';
import { MovieFilterComponent } from '../../features/movies/components/movie-filter/movie-filter.component';

export const movieRoutes: Routes = [
  {
    path: '',
    component: MoviePageComponent,
    children: [
      { path: 'by-title', component: MovieSearchComponent },
      { path: 'by-filter', component: MovieFilterComponent },
      { path: '', redirectTo: 'by-title', pathMatch: 'full' },
    ],
  },
];
