
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/questionnaire";

interface TipoPeticaoStepProps {
  form: UseFormReturn<FormValues>;
}

const TipoPeticaoStep = ({ form }: TipoPeticaoStepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="tipo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Petição</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de petição" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="trabalhista">Trabalhista</SelectItem>
                <SelectItem value="indenizatoria">Cível (Indenizatória)</SelectItem>
                <SelectItem value="divorcio">Divórcio</SelectItem>
                <SelectItem value="habeas-corpus">Habeas Corpus</SelectItem>
                <SelectItem value="execucao">Execução de Título Extrajudicial</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TipoPeticaoStep;
