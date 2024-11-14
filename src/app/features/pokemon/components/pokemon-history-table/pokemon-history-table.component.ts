import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonData } from '../../../../shared/types/pokemon-data';
import { PokemonTypesComponent } from '../pokemon-types/pokemon-types.component';

@Component({
  selector: 'app-pokemon-history-table',
  standalone: true,
  imports: [CommonModule, PokemonTypesComponent],
  template: `
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Recent Pokemon Searches</h2>
      <table class="w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Pokemon
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Sprite
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Types
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          @for (pokemon of searchHistory(); track pokemon.name) {
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ pokemon.name | titlecase }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <img
                [src]="pokemon.sprites.front_default"
                [alt]="pokemon.name"
                class="h-12 w-12"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <app-pokemon-types [types]="pokemon.types" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <div class="flex justify-end space-x-2">
                <button
                  (click)="reloadPokemon(pokemon)"
                  class="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                  title="Reload Pokemon"
                >
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
                <button
                  (click)="deletePokemon(pokemon)"
                  class="text-red-600 hover:text-red-900 transition-colors duration-150"
                  title="Delete from history"
                >
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class PokemonHistoryTableComponent {
  searchHistory = input<PokemonData[]>([]);
  deleteEntry = output<PokemonData>();
  reloadEntry = output<PokemonData>();

  deletePokemon(pokemon: PokemonData) {
    this.deleteEntry.emit(pokemon);
  }

  reloadPokemon(pokemon: PokemonData) {
    this.reloadEntry.emit(pokemon);
  }
}
