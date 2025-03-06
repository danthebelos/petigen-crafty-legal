
import React from "react";
import { FormField } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/questionnaire";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface VerbasTrabalhistas {
  form: UseFormReturn<FormValues>;
}

const VerbasTrabalhistas = ({ form }: VerbasTrabalhistas) => {
  // Renderiza um checkbox para cada opção de verba
  const renderCheckbox = (name: string, label: string) => {
    return (
      <FormField
        control={form.control}
        name={`verbas.${name}` as any}
        render={({ field }) => (
          <div className="flex items-center space-x-2 py-2">
            <div 
              className={`flex h-5 w-5 items-center justify-center rounded-sm border ${field.value ? 'bg-primary border-primary' : 'border-primary'} cursor-pointer`} 
              onClick={() => field.onChange(!field.value)}
            >
              {field.value && <Check className="h-4 w-4 text-primary-foreground" />}
            </div>
            <label 
              className="text-sm font-medium leading-none cursor-pointer"
              onClick={() => field.onChange(!field.value)}
            >
              {label}
            </label>
          </div>
        )}
      />
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verbas e Pedidos Trabalhistas</CardTitle>
          <CardDescription>
            Selecione todas as verbas e pedidos trabalhistas aplicáveis ao seu caso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {/* 1. Verbas Rescisórias */}
            <AccordionItem value="verbas-rescisorias">
              <AccordionTrigger className="text-base font-medium">
                1. Verbas Rescisórias
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {renderCheckbox("avisoPrevioTrabalhado", "Aviso Prévio Trabalhado")}
                {renderCheckbox("avisoPrevioIndenizado", "Aviso Prévio Indenizado")}
                {renderCheckbox("saldoSalario", "Saldo de Salário")}
                {renderCheckbox("feriasVencidas", "Férias Vencidas + 1/3")}
                {renderCheckbox("feriasProporcionais", "Férias Proporcionais + 1/3")}
                {renderCheckbox("decimoTerceiro", "13º Salário Proporcional")}
                {renderCheckbox("multaFgts", "Multa de 40% do FGTS (dispensa sem justa causa)")}
                {renderCheckbox("seguroDesemprego", "Seguro-Desemprego")}
                {renderCheckbox("fgtsNaoDepositado", "FGTS não depositado")}
              </AccordionContent>
            </AccordionItem>

            {/* 2. Adicionais e Benefícios */}
            <AccordionItem value="adicionais-beneficios">
              <AccordionTrigger className="text-base font-medium">
                2. Adicionais e Benefícios
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {renderCheckbox("adicionalNoturno", "Adicional Noturno")}
                {renderCheckbox("adicionalInsalubridade", "Adicional de Insalubridade")}
                {renderCheckbox("adicionalPericulosidade", "Adicional de Periculosidade")}
              </AccordionContent>
            </AccordionItem>

            {/* 3. Jornadas e Horas Extras */}
            <AccordionItem value="jornadas-horas-extras">
              <AccordionTrigger className="text-base font-medium">
                3. Jornadas e Horas Extras
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {renderCheckbox("horaExtra", "Hora Extra")}
                {renderCheckbox("intervaloInterjornada", "Intervalo Interjornada")}
                {renderCheckbox("intervaloIntrajornada", "Intervalo Intrajornada")}
              </AccordionContent>
            </AccordionItem>

            {/* 4. Direitos Relacionados à Função */}
            <AccordionItem value="direitos-funcao">
              <AccordionTrigger className="text-base font-medium">
                4. Direitos Relacionados à Função
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {renderCheckbox("acumuloFuncao", "Acúmulo de Função")}
                {renderCheckbox("desvioFuncao", "Desvio de Função")}
              </AccordionContent>
            </AccordionItem>

            {/* 5. Direitos Relacionados ao Pagamento */}
            <AccordionItem value="direitos-pagamento">
              <AccordionTrigger className="text-base font-medium">
                5. Direitos Relacionados ao Pagamento
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {renderCheckbox("salarioAtrasado", "Salário Atrasado")}
                {renderCheckbox("salarioPorFora", "Salário 'por fora'")}
                {renderCheckbox("inssNaoRecolhido", "Recolhimento do INSS não realizado")}
              </AccordionContent>
            </AccordionItem>

            {/* 6. Direitos Relacionados ao Contrato */}
            <AccordionItem value="direitos-contrato">
              <AccordionTrigger className="text-base font-medium">
                6. Direitos Relacionados ao Contrato
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {renderCheckbox("reconhecimentoVinculo", "Reconhecimento de Vínculo")}
                {renderCheckbox("registroCarteiraInexistente", "Registro de Carteira Não Efetuado")}
                {renderCheckbox("rescisaoIndireta", "Rescisão Indireta")}
                {renderCheckbox("reversaoPedidoDemissao", "Reversão do Pedido de Demissão")}
              </AccordionContent>
            </AccordionItem>

            {/* 7. Indenizações e Danos */}
            <AccordionItem value="indenizacoes-danos">
              <AccordionTrigger className="text-base font-medium">
                7. Indenizações e Danos
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {renderCheckbox("danosMorais", "Indenização por Danos Morais e Materiais")}
                {renderCheckbox("indenizacaoEstabilidade", "Indenização por Estabilidade Violada")}
                {renderCheckbox("indenizacaoDispensaDiscriminatoria", "Indenização por Dispensa Discriminatória")}
              </AccordionContent>
            </AccordionItem>

            {/* 8. Multas */}
            <AccordionItem value="multas">
              <AccordionTrigger className="text-base font-medium">
                8. Multas Aplicáveis
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {renderCheckbox("multaArt477", "Multa do Art. 477 da CLT")}
                {renderCheckbox("multaArt467", "Multa do Art. 467 da CLT")}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerbasTrabalhistas;
