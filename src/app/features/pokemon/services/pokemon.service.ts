import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { PokemonData } from '../../../shared/types/pokemon-data';

interface PokemonListResponse {
  count: number;
  results: Array<{ name: string; url: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
  private pokemonList: string[] = [];
  private maxPokemonSuggestions = 5;

  constructor(private http: HttpClient) {
    this.loadPokemonList();
  }

  private loadPokemonList() {
    this.http
      .get<PokemonListResponse>(`${this.apiUrl}?limit=100000&offset=0`)
      .subscribe({
        next: (response) => {
          this.pokemonList = response.results.map((pokemon) => pokemon.name);
        },
        error: (error) => console.error('Error loading Pokemon list:', error),
      });
  }

  getPokemon(pokemonName: string): Observable<PokemonData> {
    return this.http
      .get<PokemonData>(`${this.apiUrl}${pokemonName.toLowerCase()}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return throwError(() => new Error('Pokemon not found'));
          }
          return throwError(
            () => new Error('An error occurred while fetching Pokemon data')
          );
        })
      );
  }

  filterPokemon(searchTerm: string): string[] {
    const term = searchTerm.toLowerCase();
    return this.pokemonList
      .filter((name) => name.startsWith(term))
      .slice(0, this.maxPokemonSuggestions); // Limit to 5 suggestions
  }
}
