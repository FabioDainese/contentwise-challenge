import { gql, GraphQLClient } from "graphql-request";

export const client = new GraphQLClient(
  "https://beta.pokeapi.co/graphql/v1beta",
);

// Queries
export const GET_POKEMON_TYPES = gql`
  query getPokemonTypes {
    pokemon_v2_type {
      id
      name
    }
  }
`;

export const GET_POKEMONS_BY_TYPE = gql`
  query getPokemonsByType($pokemonTypeId: Int!, $limit: Int!, $offset: Int!) {
    pokemon_v2_pokemon(
      where: { pokemon_v2_pokemontypes: { type_id: { _eq: $pokemonTypeId } } }
      limit: $limit
      offset: $offset
      distinct_on: id
    ) {
      id
      name
      pokemon_v2_pokemonsprites {
        sprites
      }
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          id
          name
        }
      }
      # pokemon_v2_pokemonmoves(distinct_on: id) {
      #   pokemon_v2_move {
      #     id
      #     name
      #   }
      # }
      pokemon_v2_pokemonmoves_aggregate(distinct_on: id) {
        aggregate {
          count
        }
      }
      pokemon_v2_pokemonforms {
        id
        name
      }
      pokemon_v2_pokemonspecy {
        id
        name
      }
    }
  }
`;

export const GET_POKEMONS_OF_DIFFERENT_TYPE = gql`
  query getPokemonsOfDifferentType(
    $pokemonTypeId: Int!
    $limit: Int!
    $offset: Int!
  ) {
    pokemon_v2_pokemon(
      where: { pokemon_v2_pokemontypes: { type_id: { _neq: $pokemonTypeId } } }
      limit: $limit
      offset: $offset
      distinct_on: id
    ) {
      id
      name
      pokemon_v2_pokemonsprites {
        sprites
      }
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          id
          name
        }
      }
      # pokemon_v2_pokemonmoves(distinct_on: id) {
      #   pokemon_v2_move {
      #     id
      #     name
      #   }
      # }
      pokemon_v2_pokemonmoves_aggregate(distinct_on: id) {
        aggregate {
          count
        }
      }
      pokemon_v2_pokemonforms {
        id
        name
      }
      pokemon_v2_pokemonspecy {
        id
        name
      }
    }
  }
`;

// Types
export type PokemonType = {
  id: number;
  name: string;
};
export type PokemonTypeResponse = {
  pokemon_v2_type: PokemonType[];
};

export type PokemonSprite = {
  sprites: {
    back_default: string;
    back_female?: string;
    back_shiny: string;
    back_shiny_female?: string;
    front_default: string;
    from_female?: string;
    front_shiny: string;
    front_shiny_female?: string;
    other: any;
    verion: any;
  };
};
export type PokemonMove = {
  id: number;
  name: string;
};
export type PokemonForm = {
  id: number;
  name: string;
};
export type PokemonSpecy = {
  id: number;
  name: string;
};
export type Pokemon = {
  id: number;
  name: string;
  pokemon_v2_pokemonsprites: PokemonSprite[];
  pokemon_v2_pokemontypes: { pokemon_v2_type: PokemonType }[];
  // pokemon_v2_pokemonmoves: { pokemon_v2_move: PokemonMove }[];
  pokemon_v2_pokemonmoves_aggregate: { aggregate: { count: number } };
  pokemon_v2_pokemonforms: PokemonForm[];
  pokemon_v2_pokemonspecy: PokemonSpecy;
};
export type PokemonResponse = {
  pokemon_v2_pokemon: Pokemon[];
};
