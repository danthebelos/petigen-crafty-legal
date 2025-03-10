import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { FormNavigation } from "./FormNavigation";
import { usePeticaoContext } from "./PeticaoContext";
import { FileText, Mic, MessageSquareText } from "lucide-react";

interface InputMethodStepProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const InputMethodStep = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit
}: InputMethodStepProps) => {
  const { formData, setFormData } = usePeticaoContext();
  const [selectedMethod, setSelectedMethod] = useState<string>(
    formData.metodoEntrada || "texto"
  );

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setFormData({ ...formData, metodoEntrada: method as any });
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Como você deseja informar os detalhes da petição?</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card 
          className={`cursor-pointer transition-all hover:border-primary ${
            selectedMethod === "texto" ? "border-2 border-primary" : ""
          }`}
          onClick={() => handleMethodSelect("texto")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-2" />
              Texto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center">
              Preencha um formulário com os detalhes da sua petição
            </p>
          </CardContent>
          <CardFooter className="pt-2 justify-center">
            <Checkbox checked={selectedMethod === "texto"} />
          </CardFooter>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all hover:border-primary ${
            selectedMethod === "conversa" ? "border-2 border-primary" : ""
          }`}
          onClick={() => handleMethodSelect("conversa")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-center">
              <Mic className="h-8 w-8 mx-auto mb-2" />
              Conversa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center">
              Converse com nosso assistente que coletará as informações necessárias
            </p>
          </CardContent>
          <CardFooter className="pt-2 justify-center">
            <Checkbox checked={selectedMethod === "conversa"} />
          </CardFooter>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all hover:border-primary ${
            selectedMethod === "mensagem" ? "border-2 border-primary" : ""
          }`}
          onClick={() => handleMethodSelect("mensagem")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-center">
              <MessageSquareText className="h-8 w-8 mx-auto mb-2" />
              Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center">
              Envie uma mensagem para nós com os detalhes da sua petição
            </p>
          </CardContent>
          <CardFooter className="pt-2 justify-center">
            <Checkbox checked={selectedMethod === "mensagem"} />
          </CardFooter>
        </Card>
      </div>
      
      <FormNavigation 
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={onPrevious}
        onNext={handleNext}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default InputMethodStep;
