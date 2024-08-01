"use client";

import { useEffect } from "react";
import { useWizardContext } from "@components/wizard-context";

const OpponentTeamSelectionPage = () => {
  const [wizardState, setWizardState] = useWizardContext();

  useEffect(() => {
    console.log(wizardState);
  }, []);

  return (
    <div>
      <h1 className="mb-8 text-center text-3xl font-bold capitalize">
        Opponent Team Selection
      </h1>
      <p>TODO</p>
    </div>
  );
};

export default OpponentTeamSelectionPage;
