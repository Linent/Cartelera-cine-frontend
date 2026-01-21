export interface Pokemon {
  id: number;
  name: string;
  sprites: SpritesPokemon;
  types: TypePokemon[];
  stats: StatsPokemon[];
}


interface SpritesPokemon{
  front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
}

interface TypePokemon {
  type: {
      name: string;
    };
}

interface StatsPokemon {
  base_stat: number;
    stat: {
      name: string;
    };
}
