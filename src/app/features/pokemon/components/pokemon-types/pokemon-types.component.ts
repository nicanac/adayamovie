import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Type } from '../../../../shared/types/pokemon-data';
import { POKEMON_TYPE_COLORS } from '../../../../constants/pokemon.constants';

@Component({
  selector: 'app-pokemon-types',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-2">
      @for (type of types; track type.type.name) {
      <span
        class="px-3 py-1 rounded-full text-sm"
        [class]="getTypeClasses(type.type.name)"
      >
        {{ type.type.name | titlecase }}
      </span>
      }
    </div>
  `,
})
export class PokemonTypesComponent {
  @Input({ required: true }) types: Type[] = [];

  getTypeClasses(typeName: string): string {
    const typeColor =
      POKEMON_TYPE_COLORS[typeName as keyof typeof POKEMON_TYPE_COLORS];
    return `${typeColor.bg} ${typeColor.text}`;
  }
}
