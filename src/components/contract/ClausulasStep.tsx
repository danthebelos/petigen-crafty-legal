
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/contract";

interface ClausulasStepProps {
  form: UseFormReturn<FormValues>;
}

const ClausulasStep = ({ form }: ClausulasStepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="objeto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objeto do Contrato</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Descreva o objeto do contrato" 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="prazo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prazo</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Prazo de vigência do contrato" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="valor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Valor do contrato" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="formaPagamento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Forma de Pagamento</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Descreva a forma de pagamento" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="clausulasAdicionais"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cláusulas Adicionais (opcional)</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Adicione outras cláusulas ou condições especiais" 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ClausulasStep;
