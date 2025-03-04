
import React from "react";
import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const FormNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSubmit 
}: FormNavigationProps) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
      >
        Voltar
      </Button>
      
      {isLastStep ? (
        <Button type="button" onClick={onSubmit}>
          Enviar Dados
        </Button>
      ) : (
        <Button type="button" onClick={onNext}>
          Próximo
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
