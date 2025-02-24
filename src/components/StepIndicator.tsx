
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center w-full mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="relative">
            <div
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors",
                index <= currentStep
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-300"
              )}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-1/2 w-full h-0.5 -translate-y-1/2 transition-colors",
                  index < currentStep ? "bg-zinc-900" : "bg-zinc-200"
                )}
                style={{ left: "100%" }}
              />
            )}
          </div>
          {index < steps.length - 1 && <div className="w-12" />}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
