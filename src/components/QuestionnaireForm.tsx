
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import StepIndicator from "@/components/StepIndicator";
import TipoPeticaoStep from "@/components/questionnaire/TipoPeticaoStep";
import DadosPessoaisStep from "@/components/questionnaire/DadosPessoaisStep";
import DadosReclamadaStep from "@/components/questionnaire/DadosReclamadaStep";
import FatosArgumentosStep from "@/components/questionnaire/FatosArgumentosStep";
import VerbasTrabalistasStep from "@/components/questionnaire/VerbasTrabalhistas";
import FormNavigation from "@/components/questionnaire/FormNavigation";
import QuestoesPreviewsStep from "@/components/questionnaire/QuestoesPreviewsStep";
import { FormValues, formSchema, steps } from "@/types/questionnaire";

interface QuestionnaireFormProps {
  onSubmit: (data: FormValues) => void;
}

const QuestionnaireForm = ({ onSubmit }: QuestionnaireFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "",
      nomeReclamante: "",
      cpfReclamante: "",
      rgReclamante: "",
      enderecoReclamante: "",
      cep: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      emailReclamante: "",
      telefoneReclamante: "",
      
      // Dados da empresa reclamada
      nomeReclamada: "",
      cnpjReclamada: "",
      razaoSocialReclamada: "",
      enderecoReclamada: "",
      emailReclamado: "",
      telefoneReclamado: "",
      
      juizoDigital: true,
      solicitaJusticaGratuita: true,
      descricaoFatos: "",
      argumentos: "",
      pedidos: "",
      verbasTrabalhistas: [],
    },
  });

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForCurrentStep();
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
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
    const currentStepId = steps[currentStep]?.id || "tipo";
    
    switch (currentStepId) {
      case "tipo":
        return ["tipo"];
      case "parte":
        return ["nomeReclamante", "cpfReclamante"];
      case "parte-reclamada":
        return ["nomeReclamada"];
      case "fatos":
        return ["descricaoFatos"];
      case "verbas":
        return [];
      case "questoes":
        return [];
      default:
        return [];
    }
  };

  // Renderiza os campos do passo atual
  const renderStepFields = () => {
    const currentStepId = steps[currentStep]?.id || "tipo";
    
    switch (currentStepId) {
      case "tipo":
        return <TipoPeticaoStep form={form} />;
      case "parte":
        return <DadosPessoaisStep form={form} />;
      case "parte-reclamada":
        return <DadosReclamadaStep form={form} />;
      case "fatos":
        return <FatosArgumentosStep form={form} />;
      case "verbas":
        return <VerbasTrabalistasStep form={form} />;
      case "questoes":
        return <QuestoesPreviewsStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <StepIndicator steps={steps.map(step => step.label)} currentStep={currentStep} />
          
          <div className="mt-6">
            {renderStepFields()}
          </div>
          
          {form.formState.errors.root?.message && (
            <div className="text-red-500 text-sm mt-2">
              {form.formState.errors.root.message}
            </div>
          )}
          
          <FormNavigation 
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrevious={prevStep}
            onNext={nextStep}
            onSubmit={handleFormSubmit}
          />
        </form>
      </Form>
    </div>
  );
};

export default QuestionnaireForm;
