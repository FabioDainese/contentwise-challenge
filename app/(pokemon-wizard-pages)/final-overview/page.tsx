"use client";

import { useEffect } from "react";
import { useWizardContext } from "@components/wizard-context";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

// Components
import { Button } from "@components/ui/button";
import Link from "next/link";

// Styles
import { buttonVariants } from "@components/ui/button";

const FinalOverviewPage = () => {
  const [wizardState, setWizardState] = useWizardContext();
  const router = useRouter();

  useEffect(() => {
    const { pokemonTypeId, teamName, playerName, pokemons } = wizardState;
    if (!pokemonTypeId || !teamName || !playerName || !pokemons) {
      router.push("/trainer-details");
    } else {
      console.log(wizardState);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-8 max-w-md rounded-xl bg-green-200 px-10 py-6 text-center text-3xl font-bold capitalize text-green-800">
        Congratulations, you are now ready to start your Pokémon journey!
      </h1>
      <Link
        href="/"
        className={twMerge(
          "mt-10 w-fit",
          buttonVariants({ variant: "outline" }),
        )}
      >
        Go back to the homepage
      </Link>
    </div>
  );
};

export default FinalOverviewPage;
