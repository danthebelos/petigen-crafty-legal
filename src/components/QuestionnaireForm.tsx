
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import StepIndicator from "@/components/StepIndicator";
import QuestionTooltip from "@/components/QuestionTooltip";
import { useToast } from "@/hooks/use-toast";

interface QuestionnaireFormProps {
  onFinalize?: () => void;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ onFinalize }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [petitionType, setPetitionType] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const handleNextStep = () => {
    if (petitionType === "") {
      toast({
        title: "Selecione um tipo de petição",
        description: "É necessário selecionar um tipo de petição para continuar",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    // Simulando envio do formulário
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: "Petição gerada com sucesso!",
        description: "Selecione um modelo para finalizar sua petição."
      });
      
      if (onFinalize) {
        onFinalize();
      }
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
      <StepIndicator
        currentStep={currentStep}
        steps={[
          { label: "Tipo de Petição", description: "Selecione o tipo" },
          { label: "Informações", description: "Dados necessários" },
          { label: "Revisão", description: "Confirme os dados" },
        ]}
      />

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900">
              Selecione o tipo de petição
            </h2>
            
            <div className="grid gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="petition-type">Tipo de Petição</Label>
                <Select
                  value={petitionType}
                  onValueChange={(value) => {
                    setPetitionType(value);
                    handleChange("tipo", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo de petição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="indenizatoria">Cível (Indenizatória)</SelectItem>
                    <SelectItem value="divorcio">Divórcio</SelectItem>
                    <SelectItem value="habeas-corpus">Habeas Corpus</SelectItem>
                    <SelectItem value="execucao">Execução de Título Extrajudicial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button type="button" onClick={handleNextStep}>
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Formulário específico para cada tipo de petição */}
            {petitionType === "trabalhista" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Petição Trabalhista
                </h2>
                
                {/* Dados do Cliente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900 flex items-center">
                    Dados do Cliente
                    <QuestionTooltip content="Informações pessoais do reclamante" />
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-reclamante">Nome completo do reclamante</Label>
                      <Input
                        id="nome-reclamante"
                        onChange={(e) => handleChange("nomeReclamante", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpf-reclamante">CPF</Label>
                      <Input
                        id="cpf-reclamante"
                        onChange={(e) => handleChange("cpfReclamante", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rg-reclamante">RG e órgão expedidor</Label>
                      <Input
                        id="rg-reclamante"
                        onChange={(e) => handleChange("rgReclamante", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endereco-reclamante">Endereço completo</Label>
                      <Input
                        id="endereco-reclamante"
                        onChange={(e) => handleChange("enderecoReclamante", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telefone-reclamante">Telefone</Label>
                      <Input
                        id="telefone-reclamante"
                        onChange={(e) => handleChange("telefoneReclamante", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email-reclamante">Email</Label>
                      <Input
                        id="email-reclamante"
                        onChange={(e) => handleChange("emailReclamante", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estado-civil-reclamante">Estado civil</Label>
                      <Select
                        onValueChange={(value) => handleChange("estadoCivilReclamante", value)}
                      >
                        <SelectTrigger id="estado-civil-reclamante">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                          <SelectItem value="casado">Casado(a)</SelectItem>
                          <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                          <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                          <SelectItem value="uniao-estavel">União Estável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="data-nascimento-reclamante">Data de nascimento</Label>
                      <Input
                        id="data-nascimento-reclamante"
                        type="date"
                        onChange={(e) => handleChange("dataNascimentoReclamante", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pis-reclamante">PIS/PASEP</Label>
                      <Input
                        id="pis-reclamante"
                        onChange={(e) => handleChange("pisReclamante", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ctps-reclamante">CTPS (número, série e UF)</Label>
                      <Input
                        id="ctps-reclamante"
                        onChange={(e) => handleChange("ctpsReclamante", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Dados da Reclamada */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900 flex items-center">
                    Dados da Reclamada
                    <QuestionTooltip content="Informações da empresa reclamada" />
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="razao-social-reclamada">Razão social da empresa</Label>
                      <Input
                        id="razao-social-reclamada"
                        onChange={(e) => handleChange("razaoSocialReclamada", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cnpj-reclamada">CNPJ</Label>
                      <Input
                        id="cnpj-reclamada"
                        onChange={(e) => handleChange("cnpjReclamada", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endereco-reclamada">Endereço completo</Label>
                      <Input
                        id="endereco-reclamada"
                        onChange={(e) => handleChange("enderecoReclamada", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="representante-reclamada">Nome do representante legal (se conhecido)</Label>
                      <Input
                        id="representante-reclamada"
                        onChange={(e) => handleChange("representanteReclamada", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Informações do Contrato de Trabalho */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900 flex items-center">
                    Informações do Contrato de Trabalho
                    <QuestionTooltip content="Dados sobre o vínculo empregatício" />
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="data-admissao">Data de admissão</Label>
                      <Input
                        id="data-admissao"
                        type="date"
                        onChange={(e) => handleChange("dataAdmissao", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="data-demissao">Data de demissão (se aplicável)</Label>
                      <Input
                        id="data-demissao"
                        type="date"
                        onChange={(e) => handleChange("dataDemissao", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="funcao">Função exercida</Label>
                      <Input
                        id="funcao"
                        onChange={(e) => handleChange("funcao", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ultimo-salario">Último salário</Label>
                      <Input
                        id="ultimo-salario"
                        type="number"
                        step="0.01"
                        onChange={(e) => handleChange("ultimoSalario", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jornada-contratual">Jornada de trabalho contratual</Label>
                      <Input
                        id="jornada-contratual"
                        onChange={(e) => handleChange("jornadaContratual", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jornada-efetiva">Jornada efetivamente cumprida</Label>
                      <Input
                        id="jornada-efetiva"
                        onChange={(e) => handleChange("jornadaEfetiva", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label>Tipo de demissão (se aplicável)</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("tipoDemissao", value)}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sem-justa-causa" id="sem-justa-causa" />
                          <Label htmlFor="sem-justa-causa">Sem justa causa</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="com-justa-causa" id="com-justa-causa" />
                          <Label htmlFor="com-justa-causa">Com justa causa</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pedido-demissao" id="pedido-demissao" />
                          <Label htmlFor="pedido-demissao">Pedido de demissão</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                
                {/* Pedidos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900 flex items-center">
                    Pedidos
                    <QuestionTooltip content="Selecione os direitos que deseja pleitear" />
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="verbas-rescisorias"
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("verbasRescisorias", checked === true)
                        }
                      />
                      <div className="grid gap-1.5">
                        <Label htmlFor="verbas-rescisorias" className="font-medium">
                          Verbas rescisórias não pagas
                        </Label>
                        <Input 
                          placeholder="Especificar quais verbas"
                          onChange={(e) => handleChange("verbasRescisoriasDetalhe", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="horas-extras"
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("horasExtras", checked === true)
                        }
                      />
                      <div className="grid gap-1.5">
                        <Label htmlFor="horas-extras" className="font-medium">
                          Horas extras
                        </Label>
                        <Input 
                          placeholder="Período e quantidade aproximada"
                          onChange={(e) => handleChange("horasExtrasDetalhe", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="adicional-noturno"
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("adicionalNoturno", checked === true)
                        }
                      />
                      <div className="grid gap-1.5">
                        <Label htmlFor="adicional-noturno" className="font-medium">
                          Adicional noturno
                        </Label>
                        <Input 
                          placeholder="Período"
                          onChange={(e) => handleChange("adicionalNoturnoDetalhe", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="adicional-insalubridade"
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("adicionalInsalubridade", checked === true)
                        }
                      />
                      <Label htmlFor="adicional-insalubridade" className="font-medium">
                        Adicional de insalubridade/periculosidade
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="equiparacao-salarial"
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("equiparacaoSalarial", checked === true)
                        }
                      />
                      <div className="grid gap-1.5">
                        <Label htmlFor="equiparacao-salarial" className="font-medium">
                          Equiparação salarial
                        </Label>
                        <Input 
                          placeholder="Informar cargo e nome do paradigma"
                          onChange={(e) => handleChange("equiparacaoSalarialDetalhe", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="danos-morais"
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("danosMorais", checked === true)
                        }
                      />
                      <div className="grid gap-1.5">
                        <Label htmlFor="danos-morais" className="font-medium">
                          Danos morais
                        </Label>
                        <Textarea 
                          placeholder="Especificar fatos"
                          onChange={(e) => handleChange("danosMoraisDetalhe", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="outros-pedidos"
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("outrosPedidos", checked === true)
                        }
                      />
                      <div className="grid gap-1.5">
                        <Label htmlFor="outros-pedidos" className="font-medium">
                          Outros pedidos
                        </Label>
                        <Textarea 
                          placeholder="Especificar"
                          onChange={(e) => handleChange("outrosPedidosDetalhe", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Informações Complementares */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900 flex items-center">
                    Informações Complementares
                    <QuestionTooltip content="Dados adicionais importantes para o processo" />
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Existem testemunhas?</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("testemunhas", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="testemunhas-sim" />
                          <Label htmlFor="testemunhas-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="testemunhas-nao" />
                          <Label htmlFor="testemunhas-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Possui documentos comprobatórios?</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("documentos", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="documentos-sim" />
                          <Label htmlFor="documentos-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="documentos-nao" />
                          <Label htmlFor="documentos-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quais-documentos">Quais documentos possui?</Label>
                      <Textarea
                        id="quais-documentos"
                        placeholder="Cartão de ponto, contracheques, etc."
                        onChange={(e) => handleChange("quaisDocumentos", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Houve tentativa de resolução extrajudicial?</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("tentativaExtrajudicial", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="tentativa-sim" />
                          <Label htmlFor="tentativa-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="tentativa-nao" />
                          <Label htmlFor="tentativa-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>O cliente deseja propor acordo?</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("desejaAcordo", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="acordo-sim" />
                          <Label htmlFor="acordo-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="acordo-nao" />
                          <Label htmlFor="acordo-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="valor-acordo">Valor sugerido para acordo</Label>
                      <Input
                        id="valor-acordo"
                        type="number"
                        step="0.01"
                        onChange={(e) => handleChange("valorAcordo", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {petitionType === "indenizatoria" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Petição Inicial Cível (Indenizatória)
                </h2>
                
                {/* Dados do Autor */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900 flex items-center">
                    Dados do Autor
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-autor">Nome completo</Label>
                      <Input
                        id="nome-autor"
                        onChange={(e) => handleChange("nomeAutor", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpf-autor">CPF</Label>
                      <Input
                        id="cpf-autor"
                        onChange={(e) => handleChange("cpfAutor", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rg-autor">RG e órgão expedidor</Label>
                      <Input
                        id="rg-autor"
                        onChange={(e) => handleChange("rgAutor", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endereco-autor">Endereço completo</Label>
                      <Input
                        id="endereco-autor"
                        onChange={(e) => handleChange("enderecoAutor", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telefone-autor">Telefone</Label>
                      <Input
                        id="telefone-autor"
                        onChange={(e) => handleChange("telefoneAutor", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email-autor">Email</Label>
                      <Input
                        id="email-autor"
                        onChange={(e) => handleChange("emailAutor", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estado-civil-autor">Estado civil</Label>
                      <Select
                        onValueChange={(value) => handleChange("estadoCivilAutor", value)}
                      >
                        <SelectTrigger id="estado-civil-autor">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                          <SelectItem value="casado">Casado(a)</SelectItem>
                          <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                          <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                          <SelectItem value="uniao-estavel">União Estável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profissao-autor">Profissão</Label>
                      <Input
                        id="profissao-autor"
                        onChange={(e) => handleChange("profissaoAutor", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Dados do Réu */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900 flex items-center">
                    Dados do Réu
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-reu">Nome/Razão social</Label>
                      <Input
                        id="nome-reu"
                        onChange={(e) => handleChange("nomeReu", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpf-cnpj-reu">CPF/CNPJ</Label>
                      <Input
                        id="cpf-cnpj-reu"
                        onChange={(e) => handleChange("cpfCnpjReu", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="endereco-reu">Endereço completo</Label>
                      <Input
                        id="endereco-reu"
                        onChange={(e) => handleChange("enderecoReu", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Informações da Causa */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900 flex items-center">
                    Informações da Causa
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tipo de dano</Label>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="dano-material" 
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("danoMaterial", checked === true)
                            }
                          />
                          <Label htmlFor="dano-material">Material</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="dano-moral" 
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("danoMoral", checked === true)
                            }
                          />
                          <Label htmlFor="dano-moral">Moral</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="dano-estetico" 
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("danoEstetico", checked === true)
                            }
                          />
                          <Label htmlFor="dano-estetico">Estético</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="dano-outro" 
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("danoOutro", checked === true)
                            }
                          />
                          <Label htmlFor="dano-outro">Outro</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="data-evento">Data do evento danoso</Label>
                      <Input
                        id="data-evento"
                        type="date"
                        onChange={(e) => handleChange("dataEvento", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="local-evento">Local do evento</Label>
                      <Input
                        id="local-evento"
                        onChange={(e) => handleChange("localEvento", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="descricao-fato">Descrição resumida do fato</Label>
                      <Textarea
                        id="descricao-fato"
                        onChange={(e) => handleChange("descricaoFato", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="valor-prejuizo">Valor aproximado do prejuízo material (se aplicável)</Label>
                      <Input
                        id="valor-prejuizo"
                        type="number"
                        step="0.01"
                        onChange={(e) => handleChange("valorPrejuizo", e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Houve lesão física?</Label>
                        <RadioGroup
                          onValueChange={(value) => handleChange("houveLesao", value)}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sim" id="lesao-sim" />
                            <Label htmlFor="lesao-sim">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="nao" id="lesao-nao" />
                            <Label htmlFor="lesao-nao">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Houve tratamento médico?</Label>
                        <RadioGroup
                          onValueChange={(value) => handleChange("houveTratamento", value)}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sim" id="tratamento-sim" />
                            <Label htmlFor="tratamento-sim">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="nao" id="tratamento-nao" />
                            <Label htmlFor="tratamento-nao">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="periodo-tratamento">Período de tratamento ou afastamento</Label>
                      <Input
                        id="periodo-tratamento"
                        onChange={(e) => handleChange("periodoTratamento", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Houve sequela permanente?</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("houveSequela", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="sequela-sim" />
                          <Label htmlFor="sequela-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="sequela-nao" />
                          <Label htmlFor="sequela-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                
                {/* Provas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900 flex items-center">
                    Provas
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Possui documentos comprobatórios?</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("possuiDocumentos", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="documentos-prova-sim" />
                          <Label htmlFor="documentos-prova-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="documentos-prova-nao" />
                          <Label htmlFor="documentos-prova-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quais-documentos-prova">Quais documentos</Label>
                      <Input
                        id="quais-documentos-prova"
                        placeholder="Notas fiscais, laudos, fotos, etc."
                        onChange={(e) => handleChange("quaisDocumentosProva", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Existem testemunhas?</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("existemTestemunhas", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="testemunhas-prova-sim" />
                          <Label htmlFor="testemunhas-prova-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="testemunhas-prova-nao" />
                          <Label htmlFor="testemunhas-prova-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Necessidade de perícia?</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("necessidadePericia", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="pericia-sim" />
                          <Label htmlFor="pericia-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="pericia-nao" />
                          <Label htmlFor="pericia-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                
                {/* Pedidos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900 flex items-center">
                    Pedidos
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="valor-danos-morais">Valor da indenização por danos morais pretendida</Label>
                      <Input
                        id="valor-danos-morais"
                        type="number"
                        step="0.01"
                        onChange={(e) => handleChange("valorDanosMorais", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="valor-danos-materiais">Valor da indenização por danos materiais pretendida</Label>
                      <Input
                        id="valor-danos-materiais"
                        type="number"
                        step="0.01"
                        onChange={(e) => handleChange("valorDanosMateriais", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="outros-pedidos-indenizacao">Outros pedidos</Label>
                      <Textarea
                        id="outros-pedidos-indenizacao"
                        placeholder="Especificar"
                        onChange={(e) => handleChange("outrosPedidosIndenizacao", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Interesse em audiência de conciliação?</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("interesseConciliacao", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="conciliacao-sim" />
                          <Label htmlFor="conciliacao-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="conciliacao-nao" />
                          <Label htmlFor="conciliacao-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Formulários para os outros tipos de petição iriam aqui */}
            {/* Você pode adicionar os demais formulários seguindo o mesmo padrão */}
            
            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={handlePreviousStep}>
                Voltar
              </Button>
              <Button type="button" onClick={handleNextStep}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900">
              Revisão de Dados
            </h2>
            
            <div className="space-y-4 bg-zinc-50 p-6 rounded-lg">
              <h3 className="font-medium text-zinc-900">
                Tipo de Petição: {petitionType === "trabalhista" ? "Trabalhista" : 
                                  petitionType === "indenizatoria" ? "Cível (Indenizatória)" : 
                                  petitionType === "divorcio" ? "Divórcio" : 
                                  petitionType === "habeas-corpus" ? "Habeas Corpus" : 
                                  petitionType === "execucao" ? "Execução de Título Extrajudicial" : ""}
              </h3>
              
              <div className="border-t border-zinc-200 pt-4">
                <p className="text-zinc-500 text-sm mb-2">
                  Verifique se todos os dados estão corretos antes de finalizar.
                </p>
                
                <div className="prose prose-zinc prose-sm max-w-none">
                  <p>
                    Ao prosseguir, o sistema gerará uma petição com base nos dados fornecidos.
                    O documento poderá ser editado posteriormente, se necessário.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={handlePreviousStep}>
                Voltar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="relative"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                    <span>Gerando petição...</span>
                  </div>
                ) : (
                  "Finalizar petição"
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default QuestionnaireForm;
