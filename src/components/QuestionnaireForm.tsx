
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import StepIndicator from "@/components/StepIndicator";
import InputMethodStep from "@/components/questionnaire/InputMethodStep";
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
  const [activeSteps, setActiveSteps] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputMethod: "questionario",
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
      descricaoBreve: "",
    },
  });

  // Atualiza os passos ativos com base no método de entrada selecionado
  useEffect(() => {
    const inputMethod = form.watch("inputMethod");
    
    if (inputMethod === "questionario") {
      setActiveSteps(steps.map(step => step.id));
    } else if (inputMethod === "documento") {
      // No método de documento, pulamos alguns passos
      setActiveSteps(["metodo", "tipo", "documento"]);
    }
  }, [form.watch("inputMethod")]);

  // Obtém o índice do passo atual no array de passos ativos
  const getActiveStepIndex = (stepId: string) => {
    return activeSteps.indexOf(stepId);
  };

  // Obtém o ID do passo pelo índice atual
  const getCurrentStepId = () => {
    return activeSteps[currentStep] || "metodo";
  };

  // Obtém os rótulos dos passos ativos
  const getActiveStepLabels = () => {
    return steps
      .filter(step => activeSteps.includes(step.id))
      .map(step => step.label);
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForCurrentStep();
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, activeSteps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleDocumentChange = (file: File | null) => {
    setUploadedDocument(file);
  };

  const handleFormSubmit = () => {
    const isDocumentMethod = form.getValues("inputMethod") === "documento";
    
    // Validar se há um documento anexado quando o método é documento
    if (isDocumentMethod && !uploadedDocument) {
      form.setError("root", { 
        type: "manual", 
        message: "É necessário anexar um documento para prosseguir" 
      });
      return;
    }
    
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
    const currentStepId = getCurrentStepId();
    
    switch (currentStepId) {
      case "metodo":
        return ["inputMethod"];
      case "tipo":
        return ["tipo"];
      case "parte":
        return ["nomeReclamante", "cpfReclamante", "rgReclamante", "enderecoReclamante"];
      case "fatos":
        return ["descricaoFatos"];
      case "documento":
        // Se for método de documento direto, exigir descrição breve
        return form.getValues("inputMethod") === "documento" ? ["descricaoBreve"] : [];
      default:
        return [];
    }
  };

  // Renderiza os campos do passo atual
  const renderStepFields = () => {
    const currentStepId = getCurrentStepId();
    const isDocumentMethod = form.getValues("inputMethod") === "documento";
    
    switch (currentStepId) {
      case "metodo":
        return <InputMethodStep form={form} />;
      case "tipo":
        return <TipoPeticaoStep form={form} />;
      case "parte":
        return <DadosPessoaisStep form={form} />;
      case "fatos":
        return <FatosArgumentosStep form={form} />;
      case "documento":
        return <DocumentUploadStep 
          form={form} 
          onDocumentChange={handleDocumentChange} 
          isDirectUpload={isDocumentMethod}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <StepIndicator steps={getActiveStepLabels()} currentStep={currentStep} />
          
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
            totalSteps={activeSteps.length}
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
