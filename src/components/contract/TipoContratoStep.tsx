
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/contract";

interface TipoContratoStepProps {
  form: UseFormReturn<FormValues>;
}

const TipoContratoStep = ({ form }: TipoContratoStepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="tipo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Contrato</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de contrato" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="locacao">Locação</SelectItem>
                <SelectItem value="prestacao">Prestação de Serviços</SelectItem>
                <SelectItem value="compra">Compra e Venda</SelectItem>
                <SelectItem value="trabalho">Contrato de Trabalho</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TipoContratoStep;
