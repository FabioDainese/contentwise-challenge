"use client";

import { createContext, useContext, useState } from "react";
import { z } from "zod";

// Types/Models/Schemas/...
type WizardProviderProps = {
  children: React.ReactNode;
};
import { WizzardFormSchemaStep1 } from "@lib/zod-schemas";
import { Pokemon } from "@lib/pokemon-api";

type WizzardStep1Type = z.infer<typeof WizzardFormSchemaStep1>;
type WizzardStep2Type = {
  pokemons: Pokemon[];
};
type WizardStateType = Omit<WizzardStep1Type, "pokemonTypeId"> & {
  pokemonTypeId: number | undefined;
} & WizzardStep2Type;
type WizardContextType = [
  WizardStateType,
  React.Dispatch<React.SetStateAction<WizardStateType>>,
];

export const WizardContext = createContext<WizardContextType | undefined>(
  undefined,
);

const WizardProvider = ({ children }: WizardProviderProps) => {
  const wizardState = useState<WizardStateType>({
    playerName: "",
    teamName: "",
    pokemonTypeId: undefined,
    pokemons: [],
  });

  return (
    <WizardContext.Provider value={wizardState}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizardContext = () => {
  const context = useContext(WizardContext);

  if (!context) {
    throw new Error("'useWizardContext' must be used inside 'WizardProvider'.");
  }

  return context;
};

export default WizardProvider;
