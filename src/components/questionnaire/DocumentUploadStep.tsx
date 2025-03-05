
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/questionnaire";
import QuestionTooltip from "@/components/QuestionTooltip";

interface DocumentUploadStepProps {
  form: UseFormReturn<FormValues>;
  onDocumentChange: (file: File | null) => void;
  isDirectUpload?: boolean;
}

const DocumentUploadStep = ({ form, onDocumentChange, isDirectUpload = false }: DocumentUploadStepProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onDocumentChange(e.target.files[0]);
    } else {
      onDocumentChange(null);
    }
  };

  return (
    <div className="space-y-4">
      {isDirectUpload && (
        <FormField
          control={form.control}
          name="descricaoBreve"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição Breve do Caso</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva brevemente do que se trata o caso ou pedido" 
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="font-medium text-zinc-900">
            {isDirectUpload ? "Documento do Caso" : "Anexar Documento (opcional)"}
          </h3>
          <QuestionTooltip content={
            isDirectUpload 
              ? "Faça upload de um documento com todas as informações do caso. O documento será analisado para gerar a petição."
              : "Você pode anexar um documento com informações adicionais sobre o caso, como testemunhos, provas ou outros detalhes relevantes que serão considerados na geração da petição."
          } />
        </div>
        <p className="text-sm text-zinc-600 mb-4">
          {isDirectUpload 
            ? "O documento deve conter todas as informações necessárias para a geração da petição."
            : "O documento será analisado para extrair informações adicionais que enriquecerão sua petição."
          }
          Formatos aceitos: PDF, DOC, DOCX, TXT.
        </p>
        <Input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="w-full"
          required={isDirectUpload}
        />
        <p className="text-xs text-zinc-500 mt-1">
          Tamanho máximo: 10MB
        </p>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
