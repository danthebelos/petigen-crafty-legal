
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { FormValues } from "@/types/questionnaire";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import AdvogadoSelection from "./AdvogadoSelection";
import FormNavigation from "./FormNavigation";

const InputMethodStep = ({ form, onNext, onBack }: { 
  form: UseFormReturn<FormValues>;
  onNext: () => void;
  onBack: () => void;
}) => {
  const [inputMethod, setInputMethod] = useState<"form" | "text">("form");

  const handleTabChange = (value: string) => {
    setInputMethod(value as "form" | "text");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Método de Entrada</h2>
        <p className="text-muted-foreground">
          Escolha como deseja fornecer as informações para a petição.
        </p>
      </div>

      <Tabs
        value={inputMethod}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Formulário Guiado</TabsTrigger>
          <TabsTrigger value="text">Texto Livre</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-6">
          <p className="text-sm text-muted-foreground">
            O formulário guiado irá solicitar informações específicas para sua petição
            passo a passo.
          </p>
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          <FormField
            control={form.control}
            name="contextoLivre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descreva seu caso</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Descreva todos os fatos relevantes do seu caso. Quanto mais detalhes, melhor será a petição gerada."
                    className="min-h-[200px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>

      <AdvogadoSelection form={form} />

      <FormNavigation onBack={onBack} onNext={onNext} />
    </div>
  );
};

export default InputMethodStep;
