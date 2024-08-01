// Components
import Stepper from "@components/stepper";

// Types/Models/Schemas/...
type PokemonWizardLayoutProps = {
  children: React.ReactNode;
};

const PokemonWizardLayout = ({
  children,
}: Readonly<PokemonWizardLayoutProps>) => {
  return (
    <>
      <Stepper
        pages={["/trainer-details", "/team-selection"]}
        className="mb-8"
      />
      {children}
    </>
  );
};

export default PokemonWizardLayout;
