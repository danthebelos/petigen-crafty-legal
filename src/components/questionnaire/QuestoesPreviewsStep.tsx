
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/questionnaire";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface QuestoesPreviewsStepProps {
  form: UseFormReturn<FormValues>;
}

const QuestoesPreviewsStep = ({ form }: QuestoesPreviewsStepProps) => {
  return (
    <div className="space-y-6">
      {/* Juízo 100% Digital */}
      <Card>
        <CardHeader>
          <CardTitle>Juízo 100% Digital</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-600">
            Com a adoção do juízo digital houve aumento da celeridade e da eficiência da prestação 
            jurisdicional, conforme a Resolução nº 345/2020 do CNJ.
          </p>
          
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="juizoDigital"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Aderir ao Juízo 100% Digital
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          {form.watch("juizoDigital") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="emailReclamante"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Reclamante</FormLabel>
                    <FormControl>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        type="email" 
                        placeholder="email@exemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="telefoneReclamante"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone do Reclamante</FormLabel>
                    <FormControl>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="(00) 00000-0000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emailReclamado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Reclamado</FormLabel>
                    <FormControl>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        type="email" 
                        placeholder="empresa@exemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="telefoneReclamado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone do Reclamado</FormLabel>
                    <FormControl>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="(00) 00000-0000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Justiça Gratuita */}
      <Card>
        <CardHeader>
          <CardTitle>Justiça Gratuita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-600">
            A justiça gratuita é um direito previsto no artigo 790, § 3º e § 4º, da CLT, para aqueles que 
            perceberem salário igual ou inferior a 40% do limite máximo do Regime Geral de Previdência Social.
          </p>
          
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="solicitaJusticaGratuita"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Solicitar o benefício da Justiça Gratuita
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestoesPreviewsStep;
