
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/questionnaire";
import QuestionTooltip from "@/components/QuestionTooltip";

interface FatosArgumentosStepProps {
  form: UseFormReturn<FormValues>;
}

const FatosArgumentosStep = ({ form }: FatosArgumentosStepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="descricaoFatos"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2">
              <FormLabel>Descrição dos Fatos</FormLabel>
              <QuestionTooltip content="Descreva em detalhes o que aconteceu, quando e como, incluindo datas e informações relevantes. Seja específico." />
            </div>
            <FormControl>
              <Textarea
                placeholder="Descreva os fatos relacionados ao seu caso..."
                className="min-h-[150px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="argumentos"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2">
              <FormLabel>Argumentos Adicionais (opcional)</FormLabel>
              <QuestionTooltip content="Argumente por que você acredita ter direito ao que está solicitando. Mencione leis, precedentes ou situações semelhantes se souber." />
            </div>
            <FormControl>
              <Textarea
                placeholder="Argumentos adicionais que reforçam seu direito..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="pedidos"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2">
              <FormLabel>Pedidos (opcional)</FormLabel>
              <QuestionTooltip content="Liste o que você espera obter com esta petição (indenização, pagamento de verbas, etc). Seja específico sobre valores e solicitações." />
            </div>
            <FormControl>
              <Textarea
                placeholder="Liste seus pedidos..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FatosArgumentosStep;
