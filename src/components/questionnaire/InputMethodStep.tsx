
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/questionnaire";
import { Label } from "@/components/ui/label";
import QuestionTooltip from "@/components/QuestionTooltip";

interface InputMethodStepProps {
  form: UseFormReturn<FormValues>;
}

const InputMethodStep = ({ form }: InputMethodStepProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-lg font-medium text-zinc-900">Como deseja gerar sua petição?</h3>
        <QuestionTooltip content="Escolha entre preencher um questionário detalhado ou enviar um documento com as informações necessárias." />
      </div>
      
      <FormField
        control={form.control}
        name="inputMethod"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-start space-x-3 border rounded-md p-4 hover:bg-zinc-50 transition-colors">
                  <RadioGroupItem value="questionario" id="questionario" className="mt-1" />
                  <div>
                    <Label htmlFor="questionario" className="text-base font-medium">Preencher questionário</Label>
                    <p className="text-sm text-zinc-600 mt-1">
                      Responda a perguntas específicas para gerar uma petição personalizada passo a passo.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 border rounded-md p-4 hover:bg-zinc-50 transition-colors">
                  <RadioGroupItem value="documento" id="documento" className="mt-1" />
                  <div>
                    <Label htmlFor="documento" className="text-base font-medium">Enviar documento</Label>
                    <p className="text-sm text-zinc-600 mt-1">
                      Faça upload de um documento com as informações do caso para gerar a petição mais rapidamente.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default InputMethodStep;
