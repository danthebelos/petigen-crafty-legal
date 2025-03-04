
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import StepIndicator from "@/components/StepIndicator";
import QuestionTooltip from "@/components/QuestionTooltip";
import CEPInput, { AddressData } from "@/components/CEPInput";
import { formatarCPF, formatarRG } from "@/utils/textFormatUtils";

// Define os passos do formulário
interface Step {
  id: string;
  label: string;
}

const steps: Step[] = [
  { id: "tipo", label: "Tipo de Petição" },
  { id: "parte", label: "Dados da Parte" },
  { id: "fatos", label: "Fatos e Argumentos" },
];

const formSchema = z.object({
  tipo: z.string().min(1, { message: "Selecione um tipo de petição" }),
  
  // Dados do reclamante
  nomeReclamante: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  cpfReclamante: z.string().min(11, { message: "CPF inválido" }),
  rgReclamante: z.string().min(5, { message: "RG inválido" }),
  enderecoReclamante: z.string().min(3, { message: "Endereço inválido" }),
  cep: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  
  // Fatos e argumentos
  descricaoFatos: z.string().min(10, { message: "Descreva os fatos com pelo menos 10 caracteres" }),
  argumentos: z.string().optional(),
  pedidos: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface QuestionnaireFormProps {
  onSubmit: (data: FormValues) => void;
}

const QuestionnaireForm = ({ onSubmit }: QuestionnaireFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "",
      nomeReclamante: "",
      cpfReclamante: "",
      rgReclamante: "",
      enderecoReclamante: "",
      cep: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      descricaoFatos: "",
      argumentos: "",
      pedidos: "",
    },
  });

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForCurrentStep();
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };

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

  // Retorna os campos a serem validados no passo atual
  const getFieldsForCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return ["tipo"];
      case 1:
        return ["nomeReclamante", "cpfReclamante", "rgReclamante", "enderecoReclamante"];
      case 2:
        return ["descricaoFatos"];
      default:
        return [];
    }
  };

  // Renderiza os campos do passo atual
  const renderStepFields = () => {
    switch (currentStep) {
      case 0:
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
      case 1:
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
      case 2:
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
      default:
        return null;
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <StepIndicator steps={steps} currentStep={currentStep} />
          
          <div className="mt-6">
            {renderStepFields()}
          </div>
          
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Voltar
            </Button>
            
            {isLastStep ? (
              <Button type="submit">Enviar Dados</Button>
            ) : (
              <Button type="button" onClick={nextStep}>
                Próximo
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuestionnaireForm;
