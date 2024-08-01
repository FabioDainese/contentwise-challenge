"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

// Types/Models/Schemas/...
type StepperProps = {
  pages: string[];
  className?: string;
};

const Stepper = ({ pages, className }: StepperProps) => {
  const pathname = usePathname();
  const activeIndex = pages.indexOf(pathname);

  return (
    <div
      className={twMerge(
        "flex items-center justify-center space-x-2",
        className,
      )}
    >
      {pages.map((page, index) => (
        <React.Fragment key={`stepper-page-${index}`}>
          <Step
            index={index + 1}
            isActive={index <= activeIndex}
            isCurrent={pathname === page}
          />
          {index !== pages.length - 1 && (
            <div
              className={twMerge(
                "h-0.5 w-12 rounded-full bg-slate-300",
                index < activeIndex && "bg-slate-950",
              )}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;

export const Step = ({
  index,
  isActive = false,
  isCurrent = false,
}: {
  index: number;
  isActive?: boolean;
  isCurrent?: boolean;
}) => {
  return (
    <div
      className={twMerge(
        "rounded-full border border-slate-400 px-5 py-3 text-xl font-bold text-slate-400",
        isActive && "border-slate-950 bg-slate-950 text-white",
        isCurrent && "ring-1 ring-slate-950 ring-offset-2",
      )}
    >
      {index}
    </div>
  );
};
