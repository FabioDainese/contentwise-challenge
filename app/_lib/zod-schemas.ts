import { z } from "zod";

export const WizzardFormSchemaStep1 = z.object({
  playerName: z
    .string()
    .min(1, { message: "The player name is required" })
    .max(100, {
      message: "The player name must be 100 or less characters long",
    }),
  teamName: z
    .string()
    .min(1, { message: "The team name is required" })
    .max(100, { message: "The team name must be 100 or less characters long" }),
  pokemonTypeId: z
    .number({
      required_error: "The pokemon type is required",
      invalid_type_error: "The pokemon type ID must be a number",
    })
    .nonnegative({
      message: "The Pokemon type ID must be a non-negative number",
    }),
});
