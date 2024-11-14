export interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface Type {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface Move {
  move: {
    name: string;
    url: string;
  };
}

export interface Sprite {
  front_default: string;
  back_default: string;
  other: {
    showdown: {
      front_default: string;
      back_default: string;
      front_shiny: string;
      back_shiny: string;
    };
  };
}

export interface PokemonData {
  name: string;
  base_stats: Stat[];
  abilities: Ability[];
  types: Type[];
  weight: number;
  height: number;
  moves: Move[];
  sprites: Sprite;
}
