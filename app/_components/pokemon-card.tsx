"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

// Components
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Skeleton } from "@components/ui/skeleton";

// Types/Models/Schemas/...
import { Pokemon } from "@lib/pokemon-api";
type PokemonCardType = {
  pokemon: Pokemon;
  disablePickPokemonButton: boolean;
  handlePickPokemon: (pokemon: Pokemon) => void;
  handleRemovePokemon: (pokemon: Pokemon) => void;
  className?: string;
};
type SkeletonPokemonCardType = {
  className?: string;
};

const PokemonCard = ({
  pokemon,
  disablePickPokemonButton,
  handlePickPokemon,
  handleRemovePokemon,
  className,
}: PokemonCardType) => {
  const {
    id: pokemonId,
    name,
    pokemon_v2_pokemonsprites: sprites,
    pokemon_v2_pokemontypes: types,
    pokemon_v2_pokemonspecy: specy,
    pokemon_v2_pokemonforms: forms,
    pokemon_v2_pokemonmoves_aggregate: moves,
  } = pokemon;
  const [isPicked, setIsPicked] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className={twMerge(
            "w-full hover:cursor-pointer md:w-[calc(50%-theme(space.3))] lg:w-[calc(25%-theme(space.3))]",
            isPicked && "border-slate-950",
            className,
          )}
        >
          <CardHeader>
            <CardTitle className="text-center capitalize">{name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Image
              src={sprites[0].sprites.front_default}
              alt={name}
              width={96}
              height={96}
              className="mx-auto"
            />
            <div className="flex flex-wrap gap-2">
              {types.map(({ pokemon_v2_type: { id, name } }) => (
                <Badge
                  key={`${pokemonId}-pokemon-type-${id}`}
                  variant="secondary"
                  className="capitalize"
                >
                  {name}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            {isPicked ? (
              <Button
                variant="destructive"
                className="w-full px-5 py-1"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemovePokemon(pokemon);
                  setIsPicked(false);
                }}
              >
                Remove pokemon
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full px-5 py-1 disabled:bg-slate-200"
                disabled={disablePickPokemonButton}
                onClick={(e) => {
                  e.preventDefault();
                  handlePickPokemon(pokemon);
                  setIsPicked(true);
                }}
              >
                Choose pokemon
              </Button>
            )}
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl capitalize">{name}</DialogTitle>
          <DialogDescription className="hidden text-lg">
            {name}
          </DialogDescription>
          <div className="flex items-center justify-center">
            <Image
              src={sprites[0].sprites.front_default}
              alt={name}
              width={140}
              height={140}
              className="basis-1/2"
            />
            <Image
              src={sprites[0].sprites.front_shiny}
              alt={name}
              width={140}
              height={140}
              className="basis-1/2"
            />
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="font-bold">Types:</span>
              {types.map(({ pokemon_v2_type: { id, name } }) => (
                <Badge
                  key={`${pokemonId}-pokemon-type-${id}`}
                  variant="secondary"
                  className="capitalize"
                >
                  {name}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="font-bold">Forms:</span>
              {forms.map(({ id, name }) => (
                <Badge
                  key={`${pokemonId}-pokemon-form-${id}`}
                  variant="secondary"
                  className="capitalize"
                >
                  {name}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="font-bold">Species:</span>
              <Badge variant="secondary" className="capitalize">
                {specy.name}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="font-bold">Total number of moves:</span>
              <Badge variant="secondary" className="capitalize">
                {moves.aggregate.count}
              </Badge>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export const SkeletonPokemonCard = ({ className }: SkeletonPokemonCardType) => {
  return (
    <Card
      className={twMerge(
        "w-full md:w-[calc(50%-theme(space.3))] lg:w-[calc(25%-theme(space.3))]",
        className,
      )}
    >
      <CardHeader>
        <Skeleton className="mx-auto h-[24px] w-3/4" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="mx-auto h-[96px] w-3/4" />
      </CardContent>
      <CardFooter>
        <Skeleton className="mx-auto h-[32px] w-3/4" />
      </CardFooter>
    </Card>
  );
};

export default PokemonCard;
