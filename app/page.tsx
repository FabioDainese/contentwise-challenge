import { twMerge } from "tailwind-merge";

// Components
import Link from "next/link";

// Styles
import { buttonVariants } from "@components/ui/button";

const HomePage = () => {
  return (
    <section className="flex flex-col items-center">
      <h1 className="mb-3 text-center text-3xl font-bold capitalize">
        Pokémon Team Builder
      </h1>
      <p className="mx-auto mb-8 max-w-3xl text-center text-slate-500">
        Guide your way through a step-by-step wizard to build your ultimate
        Pokémon team, select your favorite Pokémons, and challenge an opponent
        with a team generated just for you!
      </p>
      <Link
        href="/trainer-details"
        className={twMerge("w-fit", buttonVariants({ variant: "outline" }))}
      >
        Start Building Your Team
      </Link>
    </section>
  );
};

export default HomePage;
