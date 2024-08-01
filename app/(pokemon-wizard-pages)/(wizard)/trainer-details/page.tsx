"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizardContext } from "@components/wizard-context";
import { useRouter } from "next/navigation";
import { useToast } from "@components/ui/use-toast";

// Components
import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

// Icons
import { ChevronRight } from "lucide-react";

// Queries
import { client, GET_POKEMON_TYPES } from "@lib/pokemon-api";

// Types/Models/Schemas/...
import { WizzardFormSchemaStep1 } from "@lib/zod-schemas";
type WizzardFormStep1Inputs = z.infer<typeof WizzardFormSchemaStep1>;
import { SubmitHandler } from "react-hook-form";
import { PokemonType, PokemonTypeResponse } from "@lib/pokemon-api";

const TrainerDetailsPage = () => {
  const [wizardState, setWizardState] = useWizardContext();
  const [pokemonTypes, setPokemonTypes] = useState<PokemonType[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<WizzardFormStep1Inputs>({
    resolver: zodResolver(WizzardFormSchemaStep1),
    defaultValues: {
      playerName: wizardState.playerName || "",
      teamName: wizardState.teamName || "",
      pokemonTypeId: wizardState.pokemonTypeId || undefined,
    },
  });

  /**
   * Handler for the form submission
   */
  const onSubmit: SubmitHandler<WizzardFormStep1Inputs> = async (data) => {
    setWizardState({ ...wizardState, ...data });

    router.push("/team-selection");
  };

  /**
   * Fetch the pokemon types from the API at the first render
   */
  useEffect(() => {
    const abortController = new AbortController();

    const fetchPokemonTypes = async () => {
      try {
        const { pokemon_v2_type: data } =
          await client.request<PokemonTypeResponse>({
            document: GET_POKEMON_TYPES,
            signal: abortController.signal,
          });
        setPokemonTypes(data);
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
      }
    };

    fetchPokemonTypes();

    return () => {
      abortController.abort();
    };
  }, [toast]);

  return (
    <>
      <h1 className="mb-8 text-center text-3xl font-bold capitalize">
        Pokémon Trainer Details
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl space-y-8"
        >
          <div className="flex flex-col space-y-8 md:flex-row md:space-y-0">
            <FormField
              control={form.control}
              name="playerName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Player name</FormLabel>
                  <FormControl>
                    <Input placeholder="Insert player name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem className="flex-1 md:ml-8">
                  <FormLabel>Team name</FormLabel>
                  <FormControl>
                    <Input placeholder="Insert team name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="pokemonTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pokemon type</FormLabel>
                <Select
                  disabled={pokemonTypes.length === 0}
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value ? `${field.value}` : undefined}
                >
                  <FormControl>
                    <SelectTrigger className="truncate [&>span]:inline-block [&>span]:first-letter:uppercase">
                      {pokemonTypes.length === 0 ? (
                        "Retrieving pokemon types..."
                      ) : (
                        <SelectValue placeholder="Select your favourite pokemon type" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pokemonTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={`${type.id}`}
                        className="capitalize"
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="float-end pr-2">
            Next <ChevronRight />
          </Button>
        </form>
      </Form>
    </>
  );
};

export default TrainerDetailsPage;
