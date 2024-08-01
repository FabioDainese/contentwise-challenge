"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useWizardContext } from "@components/wizard-context";
import { useRouter } from "next/navigation";
import { useToast } from "@components/ui/use-toast";

// Components
import { Button } from "@components/ui/button";
import PokemonCard, { SkeletonPokemonCard } from "@components/pokemon-card";

// Icons
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";

// Queries
import {
  client,
  GET_POKEMONS_BY_TYPE,
  GET_POKEMONS_OF_DIFFERENT_TYPE,
} from "@lib/pokemon-api";

// Types/Models/Schemas/...
import { Pokemon, PokemonResponse } from "@lib/pokemon-api";
import { twMerge } from "tailwind-merge";

const TeamSelectionPage = () => {
  const [wizardState, setWizardState] = useWizardContext();
  const router = useRouter();
  const { toast } = useToast();
  const MAX_POKEMON_TEAM = 7;

  // Used to simulate a fake loading time before redirecting to the next page
  const [loadingState, setLoadingState] = useState(false);

  // Constants for pagination and query offset
  const POKEMONS_BY_TYPE_LIMIT = 4;
  const pokemonsOffset = useRef(0);
  const pokemonsRestOffset = useRef(0);

  // States for the pokemons of the choosen type
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loadingPokemons, setLoadingPokemon] = useState(false);
  const [reachedEndOfPokemons, setReachedEndOfPokemons] = useState(false);

  // States for the pokemons of different type
  const [pokemonsRest, setPokemonsRest] = useState<Pokemon[]>([]);
  const [loadingPokemonsRest, setLoadingPokemonRest] = useState(false);
  const [reachedEndOfPokemonsRest, setReachedEndOfPokemonsRest] =
    useState(false);

  /**
   * Fetch the pokemons of the choosen type ID
   */
  const fetchPokemonByType = useCallback(
    async ({
      pokemonTypeId,
      abortController,
    }: {
      pokemonTypeId: number;
      abortController?: AbortController;
    }) => {
      setLoadingPokemon(true);
      try {
        const { pokemon_v2_pokemon: data } =
          await client.request<PokemonResponse>({
            document: GET_POKEMONS_BY_TYPE,
            variables: {
              limit: POKEMONS_BY_TYPE_LIMIT,
              offset: pokemonsOffset.current,
              pokemonTypeId: pokemonTypeId,
            },
            signal: abortController?.signal,
          });
        pokemonsOffset.current += POKEMONS_BY_TYPE_LIMIT;
        if (data) {
          setPokemons((prevPokemons) => [...prevPokemons, ...data]);
        } else {
          setReachedEndOfPokemons(true);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name !== "AbortError") {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description:
                "There was a problem with the Pokemon API. Please try again later.",
            });
          }
        } else {
          console.error("Unexpected error", error);
        }
      } finally {
        setLoadingPokemon(false);
      }
    },
    [
      pokemonsOffset,
      setPokemons,
      setReachedEndOfPokemons,
      setLoadingPokemon,
      toast,
    ],
  );

  /**
   * Fetch the pokemons of different type
   */
  const fetchPokemonOfDifferentType = useCallback(
    async ({
      pokemonTypeId,
      abortController,
    }: {
      pokemonTypeId: number;
      abortController?: AbortController;
    }) => {
      setLoadingPokemonRest(true);
      try {
        const { pokemon_v2_pokemon: data } =
          await client.request<PokemonResponse>({
            document: GET_POKEMONS_OF_DIFFERENT_TYPE,
            variables: {
              limit: POKEMONS_BY_TYPE_LIMIT,
              offset: pokemonsRestOffset.current,
              pokemonTypeId: pokemonTypeId,
            },
            signal: abortController?.signal,
          });
        pokemonsRestOffset.current += POKEMONS_BY_TYPE_LIMIT;
        if (data) {
          setPokemonsRest((prevPokemonsRest) => [...prevPokemonsRest, ...data]);
        } else {
          setReachedEndOfPokemonsRest(true);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name !== "AbortError") {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description:
                "There was a problem with the Pokemon API. Please try again later.",
            });
          }
        } else {
          console.error("Unexpected error", error);
        }
      } finally {
        setLoadingPokemonRest(false);
      }
    },
    [
      pokemonsRestOffset,
      setPokemonsRest,
      setReachedEndOfPokemonsRest,
      setLoadingPokemonRest,
      toast,
    ],
  );

  /**
   * Function used to pick a pokemon to add it to the team
   */
  const pickPokemon = (pokemon: Pokemon) => {
    setWizardState((prevWizardState) => {
      return {
        ...prevWizardState,
        pokemons: [...prevWizardState.pokemons, pokemon],
      };
    });
  };

  /**
   * Function used to remove a picked pokemon from the team
   */
  const removePokemon = (pokemon: Pokemon) => {
    setWizardState((prevWizardState) => {
      return {
        ...prevWizardState,
        pokemons: prevWizardState.pokemons.filter((p) => p.id !== pokemon.id),
      };
    });
  };

  /**
   * Handler for the 'prev' button click
   */
  const handlePrevButtonClick = () => {
    setWizardState((prevWizardState) => {
      return {
        ...prevWizardState,
        pokemons: [],
      };
    });
    router.push("/trainer-details");
  };

  /**
   * Handler for the 'next' button click
   */
  const handleNextButtonClick = async () => {
    if (wizardState.pokemons.length === MAX_POKEMON_TEAM) {
      // router.push("/oppenent-team-selection");

      // Simulate a fake loading time before redirecting to the next page (as requested)
      setLoadingState(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoadingState(false);
      router.push("/final-overview");
    } else {
      toast({
        title: "Uh oh! Please complete your team.",
        description: `You need to pick ${MAX_POKEMON_TEAM} pokémons in order to continue.`,
      });
    }
  };

  /**
   * Initial fetch of the pokemons (on mount)
   */
  useEffect(() => {
    const abortController = new AbortController();

    const fetchInitialData = async () => {
      const { pokemonTypeId, teamName, playerName } = wizardState;
      if (!pokemonTypeId || !teamName || !playerName) {
        router.push("/trainer-details");
      } else {
        await Promise.all([
          fetchPokemonByType({ pokemonTypeId, abortController }),
          fetchPokemonOfDifferentType({ pokemonTypeId, abortController }),
        ]);
      }
    };

    setWizardState((prevWizardState) => {
      return {
        ...prevWizardState,
        pokemons: [],
      };
    });
    fetchInitialData();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="space-y-12">
      <h1 className="mb-8 text-center text-3xl font-bold capitalize">
        Pokémon Team Selection
      </h1>
      <h3 className="text-center text-2xl">
        You have picked{" "}
        <span className="font-bold">{wizardState.pokemons.length}</span>{" "}
        pokémons out of {MAX_POKEMON_TEAM}
      </h3>
      <div className="space-y-8">
        <h3 className="text-center text-xl font-bold">
          Pokemons of the choosen type
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {pokemons.map((p) => (
            <PokemonCard
              key={p.id}
              pokemon={p}
              disablePickPokemonButton={
                wizardState.pokemons.length === MAX_POKEMON_TEAM
              }
              handlePickPokemon={pickPokemon}
              handleRemovePokemon={removePokemon}
            />
          ))}
          {loadingPokemons && (
            <>
              {Array.from({ length: POKEMONS_BY_TYPE_LIMIT }).map(
                (_, index) => (
                  <SkeletonPokemonCard key={`pokemon-skeleton-${index}`} />
                ),
              )}
            </>
          )}
        </div>
        <div className="flex justify-center">
          {reachedEndOfPokemons ? (
            <p className="text-center text-sm text-gray-500">
              no more pokemon to load
            </p>
          ) : (
            <Button
              type="button"
              variant="secondary"
              disabled={loadingPokemons}
              onClick={async () => {
                if (wizardState.pokemonTypeId !== undefined) {
                  await fetchPokemonByType({
                    pokemonTypeId: wizardState.pokemonTypeId,
                  });
                } else {
                  toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description:
                      "It seems that the Pokemon type ID is not defined :(",
                  });
                }
              }}
            >
              {loadingPokemons
                ? "Loading more pokemons..."
                : "Load more pokemons"}
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-8">
        <h3 className="text-center text-xl font-bold">
          Pokemons of different type
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {pokemonsRest.map((p) => (
            <PokemonCard
              key={p.id}
              pokemon={p}
              disablePickPokemonButton={
                wizardState.pokemons.length === MAX_POKEMON_TEAM
              }
              handlePickPokemon={pickPokemon}
              handleRemovePokemon={removePokemon}
            />
          ))}
          {loadingPokemonsRest && (
            <>
              {Array.from({ length: POKEMONS_BY_TYPE_LIMIT }).map(
                (_, index) => (
                  <SkeletonPokemonCard key={`pokemon-rest-skeleton-${index}`} />
                ),
              )}
            </>
          )}
        </div>
        <div className="flex justify-center">
          {reachedEndOfPokemonsRest ? (
            <p className="text-center text-sm text-gray-500">
              no more pokemon to load
            </p>
          ) : (
            <Button
              type="button"
              variant="secondary"
              disabled={loadingPokemonsRest}
              onClick={async () => {
                if (wizardState.pokemonTypeId !== undefined) {
                  await fetchPokemonOfDifferentType({
                    pokemonTypeId: wizardState.pokemonTypeId,
                  });
                } else {
                  toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description:
                      "It seems that the Pokemon type ID is not defined :(",
                  });
                }
              }}
            >
              {loadingPokemonsRest
                ? "Loading more pokemons..."
                : "Load more pokemons"}
            </Button>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          className="pl-2"
          onClick={handlePrevButtonClick}
        >
          <ChevronLeft /> Prev
        </Button>
        <Button
          type="button"
          className={twMerge(!loadingState && "pr-2")}
          onClick={handleNextButtonClick}
          disabled={loadingState}
        >
          Next
          {loadingState ? (
            <Loader className="ml-2 animate-spin" />
          ) : (
            <ChevronRight />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TeamSelectionPage;
