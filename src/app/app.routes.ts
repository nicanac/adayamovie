import { Routes } from '@angular/router';
import { PokemonPageComponent } from './pages/pokemon/pokemon-page.component';
import { MoviePageComponent } from './pages/movies/movie-page.component';
import { ProfilePageComponent } from './pages/profile/profile-page.component';
import { PreferencesPageComponent } from './pages/preferences/preferences-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pokemon',
    pathMatch: 'full',
  },
  {
    path: 'pokemon',
    component: PokemonPageComponent,
    title: 'Pokemon Cards',
  },
  {
    path: 'movies',
    component: MoviePageComponent,
    title: 'Movie Recommendations',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
    title: 'Profile',
  },
  {
    path: 'preferences',
    loadComponent: () =>
      import('./pages/preferences/preferences-page.component').then(
        (m) => m.PreferencesPageComponent
      ),
    title: 'Preferences',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
    title: 'Login',
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./pages/auth-callback/auth-callback.component').then(
        (m) => m.AuthCallbackComponent
      ),
    title: 'Authenticating...',
  },
];
