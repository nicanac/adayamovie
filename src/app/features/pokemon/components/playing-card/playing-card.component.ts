import { PokemonService } from './../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokemonData } from '../../../../shared/types/pokemon-data';
import {
  POKEMON_TYPE_COLORS,
  MAX_STAT_VALUE,
  DISPLAYED_MOVES_COUNT,
} from '../../../../constants/pokemon.constants';
import { PokemonTypesComponent } from '../pokemon-types/pokemon-types.component';
import { PokemonHistoryTableComponent } from '../pokemon-history-table/pokemon-history-table.component';

/**
 * Component that displays a Pokémon card with detailed information.
 * Manages the display, search, and history of Pokémon data.
 */
@Component({
  selector: 'app-playing-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PokemonTypesComponent,
    PokemonHistoryTableComponent,
  ],
  templateUrl: './playing-card.component.html',
  styleUrl: './playing-card.component.scss',
})
export class PlayingCardComponent implements OnInit {
  private readonly MAX_HISTORY = 5;
  private readonly STORAGE_KEY = 'pokemon-history';

  readonly POKEMON_TYPE_COLORS = POKEMON_TYPE_COLORS;
  readonly MAX_STAT_VALUE = MAX_STAT_VALUE;
  readonly DISPLAYED_MOVES_COUNT = DISPLAYED_MOVES_COUNT;

  pokemonData = signal<PokemonData | undefined>(undefined);
  isLoading = signal(false);
  error = signal<string | undefined>(undefined);
  currentSprite = signal<'default' | 'shiny'>('default');
  pokemonName = '';
  searchTerm = signal('');
  searchHistory = signal<PokemonData[]>([]);
  isFlipped = signal(false);
  isVisible = signal(false);

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadSearchHistory();
  }

  private loadSearchHistory() {
    const history = localStorage.getItem(this.STORAGE_KEY);
    if (history) {
      this.searchHistory.set(JSON.parse(history));
    }
  }

  /**
   * Initiates Pokémon search with the given term
   * @param term - Name of the Pokémon to search
   */
  searchPokemon(term: string) {
    this.pokemonName = term;
    this.loadPokemon();
  }

  /**
   * Loads Pokémon data from the API and manages loading states
   * - Sets loading state
   * - Clears previous errors
   * - Handles animation states
   * - Updates search history on success
   */
  loadPokemon() {
    this.isLoading.set(true);
    this.error.set(undefined);
    this.isFlipped.set(true);

    this.pokemonService.getPokemon(this.pokemonName).subscribe({
      next: (pokemon) => {
        setTimeout(() => {
          this.pokemonData.set(pokemon);
          this.updateSearchHistory(pokemon);
          this.isLoading.set(false);
          this.isFlipped.set(false);
          this.isVisible.set(true);
        }, 300);
      },
      error: (err) => {
        this.error.set('Pokemon not found. Please try another name.');
        this.isLoading.set(false);
        this.isFlipped.set(false);
        this.isVisible.set(false);
        console.error('Error loading Pokemon:', err);
      },
    });
  }

  private updateSearchHistory(pokemon: PokemonData) {
    const currentHistory = this.searchHistory();
    this.searchHistory.set(
      [pokemon, ...currentHistory.filter((p) => p.name !== pokemon.name)].slice(
        0,
        this.MAX_HISTORY
      )
    );
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.searchHistory())
    );
  }

  toggleSprite() {
    this.currentSprite.set(
      this.currentSprite() === 'default' ? 'shiny' : 'default'
    );
  }

  getSpriteSrc(type: 'front' | 'back'): string {
    if (!this.pokemonData()?.sprites) return '';

    if (this.currentSprite() === 'shiny') {
      return type === 'front'
        ? this.pokemonData()?.sprites.other.showdown.front_shiny || ''
        : this.pokemonData()?.sprites.other.showdown.back_shiny || '';
    }

    return type === 'front'
      ? this.pokemonData()?.sprites.front_default || ''
      : this.pokemonData()?.sprites.back_default || '';
  }

  handleDeletePokemon(pokemon: PokemonData) {
    this.searchHistory.set(
      this.searchHistory().filter((p) => p.name !== pokemon.name)
    );
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.searchHistory())
    );
  }

  closeCard() {
    this.isVisible.set(false);
    this.pokemonData.set(undefined);
    this.searchTerm.set('');
  }

  handleBackdropClick(event: MouseEvent) {
    // Only close if clicking the backdrop, not the card itself
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.closeCard();
    }
  }
}
