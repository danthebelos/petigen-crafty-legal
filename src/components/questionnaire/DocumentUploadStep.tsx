
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/questionnaire";
import QuestionTooltip from "@/components/QuestionTooltip";

interface DocumentUploadStepProps {
  form: UseFormReturn<FormValues>;
  onDocumentChange: (file: File | null) => void;
}

const DocumentUploadStep = ({ form, onDocumentChange }: DocumentUploadStepProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onDocumentChange(e.target.files[0]);
    } else {
      onDocumentChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="font-medium text-zinc-900">Anexar Documento (opcional)</h3>
          <QuestionTooltip content="Você pode anexar um documento com informações adicionais sobre o caso, como testemunhos, provas ou outros detalhes relevantes que serão considerados na geração da petição." />
        </div>
        <p className="text-sm text-zinc-600 mb-4">
          O documento será analisado para extrair informações adicionais que enriquecerão sua petição.
          Formatos aceitos: PDF, DOC, DOCX, TXT.
        </p>
        <Input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="w-full"
        />
        <p className="text-xs text-zinc-500 mt-1">
          Tamanho máximo: 10MB
        </p>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
