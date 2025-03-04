
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/questionnaire";
import CEPInput, { AddressData } from "@/components/CEPInput";
import { formatarCPF, formatarRG } from "@/utils/textFormatUtils";

interface DadosPessoaisStepProps {
  form: UseFormReturn<FormValues>;
}

const DadosPessoaisStep = ({ form }: DadosPessoaisStepProps) => {
  // Formata o CPF enquanto o usuário digita
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: any) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Formata visualmente o CPF (123.456.789-00)
    const formattedValue = formatarCPF(value);
    e.target.value = formattedValue;
    
    // Mantém apenas os números para o valor do campo
    onChange(value);
  };

  // Formata o RG enquanto o usuário digita
  const handleRgChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: any) => {
    let value = e.target.value.replace(/[^\w]/g, '').toUpperCase();
    
    // Formata visualmente o RG
    const formattedValue = formatarRG(value);
    e.target.value = formattedValue;
    
    // Mantém o valor original para o campo
    onChange(value);
  };

  // Processa o endereço encontrado pelo CEP
  const handleAddressFound = (addressData: AddressData) => {
    form.setValue("enderecoReclamante", addressData.logradouro || "");
    form.setValue("complemento", addressData.complemento || "");
    form.setValue("bairro", addressData.bairro || "");
    form.setValue("cidade", addressData.localidade || "");
    form.setValue("estado", addressData.uf || "");
    form.setValue("cep", addressData.cep || "");
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nomeReclamante"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input placeholder="Nome completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cpfReclamante"
        render={({ field: { onChange, ...rest } }) => (
          <FormItem>
            <FormLabel>CPF</FormLabel>
            <FormControl>
              <Input 
                placeholder="123.456.789-00" 
                onChange={(e) => handleCpfChange(e, onChange)}
                {...rest} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="rgReclamante"
        render={({ field: { onChange, ...rest } }) => (
          <FormItem>
            <FormLabel>RG</FormLabel>
            <FormControl>
              <Input 
                placeholder="MG-12.345.678" 
                onChange={(e) => handleRgChange(e, onChange)}
                {...rest} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="space-y-2">
        <FormLabel>CEP</FormLabel>
        <CEPInput onAddressFound={handleAddressFound} />
      </div>
      <FormField
        control={form.control}
        name="enderecoReclamante"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rua/Avenida</FormLabel>
            <FormControl>
              <Input placeholder="Rua/Avenida" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="complemento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input placeholder="Apto, Bloco, etc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bairro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input placeholder="Bairro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input placeholder="Cidade" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input placeholder="Estado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default DadosPessoaisStep;
