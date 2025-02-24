
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StepIndicator from "./StepIndicator";
import QuestionTooltip from "./QuestionTooltip";
import { ArrowLeft, ArrowRight } from "lucide-react";

const steps = [
  "Informações Pessoais",
  "Detalhes do Caso",
  "Tipo de Ação",
  "Revisão",
];

const QuestionnaireForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    descricaoCaso: "",
    tipoAcao: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome Completo
                <QuestionTooltip content="Digite seu nome completo como consta em documentos oficiais" />
              </Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="João da Silva"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email
                <QuestionTooltip content="Seu email principal para contato" />
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="joao@email.com"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">
                Telefone
                <QuestionTooltip content="Número de telefone com DDD" />
              </Label>
              <Input
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
                className="w-full"
              />
            </div>
          </motion.div>
        );
      // Add more cases for other steps
      default:
        return <div>Em desenvolvimento...</div>;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <StepIndicator steps={steps} currentStep={currentStep} />
      
      <div className="bg-white rounded-xl shadow-sm p-8">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="flex items-center"
          >
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireForm;
