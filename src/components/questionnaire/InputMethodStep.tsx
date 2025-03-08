
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import QuestionTooltip from "../QuestionTooltip";
import FormNavigation from "./FormNavigation";
import { FormValues } from "@/types/questionnaire";

interface InputMethodStepProps {
  form: UseFormReturn<FormValues>;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

const InputMethodStep = ({ 
  form, 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext 
}: InputMethodStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Método de Entrada</h2>
          <QuestionTooltip content="Escolha como deseja inserir as informações do processo" />
        </div>
        
        <FormField
          control={form.control}
          name="metodoEntrada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Entrada</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      field.value === 'formulario' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => field.onChange('formulario')}
                  >
                    <h3 className="font-medium mb-2">Formulário</h3>
                    <p className="text-sm text-gray-500">
                      Preencha um formulário passo a passo com os detalhes do caso
                    </p>
                  </div>
                  
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      field.value === 'conversa' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => field.onChange('conversa')}
                  >
                    <h3 className="font-medium mb-2">Conversa</h3>
                    <p className="text-sm text-gray-500">
                      Converse com nosso assistente que coletará as informações necessárias
                    </p>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <FormNavigation 
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
  );
};

export default InputMethodStep;
