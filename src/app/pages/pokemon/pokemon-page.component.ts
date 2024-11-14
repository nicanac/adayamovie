import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayingCardComponent } from '../../features/pokemon/components/playing-card/playing-card.component';
import { PokemonSearchComponent } from '../../features/pokemon/components/pokemon-search/pokemon-search.component';

@Component({
  selector: 'app-pokemon-page',
  standalone: true,
  imports: [CommonModule, PlayingCardComponent, PokemonSearchComponent],
  template: `
    <div class="w-96">
      <app-pokemon-search
        [isLoading]="playingCard.isLoading()"
        [error]="playingCard.error()"
        (searchSubmitted)="playingCard.searchPokemon($event)"
      />
    </div>
    <div class="mt-8">
      <app-playing-card #playingCard></app-playing-card>
    </div>
  `,
})
export class PokemonPageComponent {}
