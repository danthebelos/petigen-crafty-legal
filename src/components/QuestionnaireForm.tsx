
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import StepIndicator from "@/components/StepIndicator";
import TipoPeticaoStep from "@/components/questionnaire/TipoPeticaoStep";
import DadosPessoaisStep from "@/components/questionnaire/DadosPessoaisStep";
import FatosArgumentosStep from "@/components/questionnaire/FatosArgumentosStep";
import DocumentUploadStep from "@/components/questionnaire/DocumentUploadStep";
import FormNavigation from "@/components/questionnaire/FormNavigation";
import { FormValues, formSchema, steps } from "@/types/questionnaire";

interface QuestionnaireFormProps {
  onSubmit: (data: FormValues, document: File | null) => void;
}

const QuestionnaireForm = ({ onSubmit }: QuestionnaireFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  
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
      verbas: {
        ferias: false,
        decimoTerceiro: false,
        fgts: false,
        multaRescisoria: false,
        avisoPrevio: false,
        horasExtras: false,
        danoMoral: false,
      },
      descricaoFatos: "",
      argumentos: "",
      pedidos: "",
    },
  });

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForCurrentStep();
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleDocumentChange = (file: File | null) => {
    setUploadedDocument(file);
  };

  const handleFormSubmit = () => {
    form.handleSubmit((data) => {
      // Se não for trabalhista, remover os dados de verbas
      if (data.tipo !== "trabalhista") {
        data.verbas = undefined;
      }
      onSubmit(data, uploadedDocument);
    })();
  };

  // Retorna os campos a serem validados no passo atual
  const getFieldsForCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return ["tipo"];
      case 1:
        return ["nomeReclamante", "cpfReclamante", "rgReclamante", "enderecoReclamante"];
      case 2:
        return ["descricaoFatos"];
      case 3:
        return []; // Documento é opcional, não precisa de validação
      default:
        return [];
    }
  };

  // Renderiza os campos do passo atual
  const renderStepFields = () => {
    switch (currentStep) {
      case 0:
        return <TipoPeticaoStep form={form} />;
      case 1:
        return <DadosPessoaisStep form={form} />;
      case 2:
        return <FatosArgumentosStep form={form} />;
      case 3:
        return <DocumentUploadStep form={form} onDocumentChange={handleDocumentChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <StepIndicator steps={steps.map(s => s.label)} currentStep={currentStep} />
          
          <div className="mt-6">
            {renderStepFields()}
          </div>
          
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
