
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import StepIndicator from "@/components/StepIndicator";
import TipoContratoStep from "@/components/contract/TipoContratoStep";
import DadosPartesStep from "@/components/contract/DadosPartesStep";
import ClausulasStep from "@/components/contract/ClausulasStep";
import FormNavigation from "@/components/questionnaire/FormNavigation";
import { FormValues, contractFormSchema, contractSteps } from "@/types/contract";

interface ContractFormProps {
  onSubmit: (data: FormValues) => void;
}

const ContractForm = ({ onSubmit }: ContractFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      tipo: "",
      nomeContratante: "",
      cpfContratante: "",
      enderecoContratante: "",
      nomeContratado: "",
      cpfContratado: "",
      enderecoContratado: "",
      objeto: "",
      prazo: "",
      valor: "",
      formaPagamento: "",
      clausulasAdicionais: "",
    },
  });

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForCurrentStep();
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, contractSteps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleFormSubmit = () => {
    form.handleSubmit((data) => {
      onSubmit(data);
    })();
  };

  // Retorna os campos a serem validados no passo atual
  const getFieldsForCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return ["tipo"];
      case 1:
        return ["nomeContratante", "cpfContratante", "enderecoContratante", "nomeContratado", "cpfContratado", "enderecoContratado"];
      case 2:
        return ["objeto", "prazo", "valor", "formaPagamento"];
      default:
        return [];
    }
  };

  // Renderiza os campos do passo atual
  const renderStepFields = () => {
    switch (currentStep) {
      case 0:
        return <TipoContratoStep form={form} />;
      case 1:
        return <DadosPartesStep form={form} />;
      case 2:
        return <ClausulasStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <StepIndicator steps={contractSteps.map(s => s.label)} currentStep={currentStep} />
          
          <div className="mt-6">
            {renderStepFields()}
          </div>
          
          <FormNavigation 
            currentStep={currentStep}
            totalSteps={contractSteps.length}
            onPrevious={prevStep}
            onNext={nextStep}
            onSubmit={handleFormSubmit}
          />
        </form>
      </Form>
    </div>
  );
};

export default ContractForm;
