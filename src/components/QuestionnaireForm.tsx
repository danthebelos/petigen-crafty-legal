
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
  onSubmit?: (data: Record<string, any>) => void;
}

interface Step {
  label: string;
  description: string;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [petitionType, setPetitionType] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, any>>({});

  const steps: Step[] = [
    { label: "Tipo de Petição", description: "Selecione o tipo" },
    { label: "Informações", description: "Dados necessários" },
    { label: "Pedidos", description: "Detalhes do pedido" },
  ];

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
    
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
      <StepIndicator
        currentStep={currentStep}
        steps={steps}
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
                  </div>
                </div>
              </div>
            )}
            
            {petitionType === "divorcio" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Divórcio
                </h2>
                
                {/* Dados dos Cônjuges */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900">Dados do Primeiro Cônjuge</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-requerente">Nome completo</Label>
                      <Input
                        id="nome-requerente"
                        onChange={(e) => handleChange("nomeRequerente", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpf-requerente">CPF</Label>
                      <Input
                        id="cpf-requerente"
                        onChange={(e) => handleChange("cpfRequerente", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profissao-requerente">Profissão</Label>
                      <Input
                        id="profissao-requerente"
                        onChange={(e) => handleChange("profissaoRequerente", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endereco-requerente">Endereço</Label>
                      <Input
                        id="endereco-requerente"
                        onChange={(e) => handleChange("enderecoRequerente", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900">Dados do Segundo Cônjuge</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-conjuge">Nome completo</Label>
                      <Input
                        id="nome-conjuge"
                        onChange={(e) => handleChange("nomeConjuge", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpf-conjuge">CPF</Label>
                      <Input
                        id="cpf-conjuge"
                        onChange={(e) => handleChange("cpfConjuge", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profissao-conjuge">Profissão</Label>
                      <Input
                        id="profissao-conjuge"
                        onChange={(e) => handleChange("profissaoConjuge", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endereco-conjuge">Endereço</Label>
                      <Input
                        id="endereco-conjuge"
                        onChange={(e) => handleChange("enderecoConjuge", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Informações do Casamento */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900">Informações do Casamento</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="data-casamento">Data do casamento</Label>
                      <Input
                        id="data-casamento"
                        type="date"
                        onChange={(e) => handleChange("dataCasamento", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="regime-bens">Regime de bens</Label>
                      <Select
                        onValueChange={(value) => handleChange("regimeBens", value)}
                      >
                        <SelectTrigger id="regime-bens">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comunhao-parcial">Comunhão Parcial</SelectItem>
                          <SelectItem value="comunhao-universal">Comunhão Universal</SelectItem>
                          <SelectItem value="separacao-total">Separação Total</SelectItem>
                          <SelectItem value="participacao-final">Participação Final nos Aquestos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="data-separacao">Data da separação de fato</Label>
                      <Input
                        id="data-separacao"
                        type="date"
                        onChange={(e) => handleChange("dataSeparacao", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Filhos do casal?</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("possuiFilhos", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="filhos-sim" />
                          <Label htmlFor="filhos-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="filhos-nao" />
                          <Label htmlFor="filhos-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="quantidade-filhos">Quantidade de filhos</Label>
                      <Input
                        id="quantidade-filhos"
                        type="number"
                        min="0"
                        onChange={(e) => handleChange("quantidadeFilhos", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="nome-filhos">Nome e idade dos filhos (se houver)</Label>
                      <Textarea
                        id="nome-filhos"
                        onChange={(e) => handleChange("nomeFilhos", e.target.value)}
                        placeholder="Ex: Maria, 10 anos; João, 7 anos"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Informações sobre Bens */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900">Informações sobre Bens</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Existem bens a partilhar?</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("possuiBens", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="bens-sim" />
                          <Label htmlFor="bens-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="bens-nao" />
                          <Label htmlFor="bens-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="descricao-bens">Descrição dos bens a partilhar</Label>
                      <Textarea
                        id="descricao-bens"
                        onChange={(e) => handleChange("descricaoBens", e.target.value)}
                        placeholder="Descreva os bens e como serão partilhados"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {petitionType === "habeas-corpus" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Habeas Corpus
                </h2>
                
                {/* Dados do Impetrante */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900">Dados do Impetrante</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-impetrante">Nome completo</Label>
                      <Input
                        id="nome-impetrante"
                        onChange={(e) => handleChange("nomeImpetrante", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpf-impetrante">CPF</Label>
                      <Input
                        id="cpf-impetrante"
                        onChange={(e) => handleChange("cpfImpetrante", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profissao-impetrante">Profissão</Label>
                      <Input
                        id="profissao-impetrante"
                        onChange={(e) => handleChange("profissaoImpetrante", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endereco-impetrante">Endereço</Label>
                      <Input
                        id="endereco-impetrante"
                        onChange={(e) => handleChange("enderecoImpetrante", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Dados do Paciente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900">Dados do Paciente</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-paciente">Nome completo</Label>
                      <Input
                        id="nome-paciente"
                        onChange={(e) => handleChange("nomePaciente", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpf-paciente">CPF</Label>
                      <Input
                        id="cpf-paciente"
                        onChange={(e) => handleChange("cpfPaciente", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profissao-paciente">Profissão</Label>
                      <Input
                        id="profissao-paciente"
                        onChange={(e) => handleChange("profissaoPaciente", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endereco-paciente">Endereço</Label>
                      <Input
                        id="endereco-paciente"
                        onChange={(e) => handleChange("enderecoPaciente", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="local-prisao">Local de prisão/detenção</Label>
                      <Input
                        id="local-prisao"
                        onChange={(e) => handleChange("localPrisao", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Autoridade Coatora */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900">Autoridade Coatora</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-autoridade">Nome da autoridade</Label>
                      <Input
                        id="nome-autoridade"
                        onChange={(e) => handleChange("nomeAutoridade", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cargo-autoridade">Cargo/Função</Label>
                      <Input
                        id="cargo-autoridade"
                        onChange={(e) => handleChange("cargoAutoridade", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="endereco-autoridade">Endereço da autoridade</Label>
                      <Input
                        id="endereco-autoridade"
                        onChange={(e) => handleChange("enderecoAutoridade", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Informações do Caso */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900">Informações do Caso</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="data-prisao">Data da prisão/ameaça</Label>
                      <Input
                        id="data-prisao"
                        type="date"
                        onChange={(e) => handleChange("dataPrisao", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="motivo-prisao">Motivo alegado para a prisão</Label>
                      <Input
                        id="motivo-prisao"
                        onChange={(e) => handleChange("motivoPrisao", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="descricao-ilegalidade">Descrição da ilegalidade da prisão</Label>
                      <Textarea
                        id="descricao-ilegalidade"
                        onChange={(e) => handleChange("descricaoIlegalidade", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tipo de ação</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("tipoAcao", value)}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="preventivo" id="preventivo" />
                          <Label htmlFor="preventivo">Preventivo (ameaça de prisão)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="liberatorio" id="liberatorio" />
                          <Label htmlFor="liberatorio">Liberatório (prisão já efetuada)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {petitionType === "execucao" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Execução de Título Extrajudicial
                </h2>
                
                {/* Dados do Exequente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900">Dados do Exequente</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-exequente">Nome completo/Razão social</Label>
                      <Input
                        id="nome-exequente"
                        onChange={(e) => handleChange("nomeExequente", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpf-cnpj-exequente">CPF/CNPJ</Label>
                      <Input
                        id="cpf-cnpj-exequente"
                        onChange={(e) => handleChange("cpfCnpjExequente", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endereco-exequente">Endereço</Label>
                      <Input
                        id="endereco-exequente"
                        onChange={(e) => handleChange("enderecoExequente", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tipo de pessoa</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("tipoPessoaExequente", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fisica" id="exequente-fisica" />
                          <Label htmlFor="exequente-fisica">Física</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="juridica" id="exequente-juridica" />
                          <Label htmlFor="exequente-juridica">Jurídica</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                
                {/* Dados do Executado */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900">Dados do Executado</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-executado">Nome completo/Razão social</Label>
                      <Input
                        id="nome-executado"
                        onChange={(e) => handleChange("nomeExecutado", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpf-cnpj-executado">CPF/CNPJ</Label>
                      <Input
                        id="cpf-cnpj-executado"
                        onChange={(e) => handleChange("cpfCnpjExecutado", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endereco-executado">Endereço</Label>
                      <Input
                        id="endereco-executado"
                        onChange={(e) => handleChange("enderecoExecutado", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tipo de pessoa</Label>
                      <RadioGroup
                        onValueChange={(value) => handleChange("tipoPessoaExecutado", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fisica" id="executado-fisica" />
                          <Label htmlFor="executado-fisica">Física</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="juridica" id="executado-juridica" />
                          <Label htmlFor="executado-juridica">Jurídica</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                
                {/* Informações do Título */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900">Informações do Título</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo-titulo">Tipo de título</Label>
                      <Select
                        onValueChange={(value) => handleChange("tipoTitulo", value)}
                      >
                        <SelectTrigger id="tipo-titulo">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cheque">Cheque</SelectItem>
                          <SelectItem value="nota-promissoria">Nota Promissória</SelectItem>
                          <SelectItem value="duplicata">Duplicata</SelectItem>
                          <SelectItem value="letra-cambio">Letra de Câmbio</SelectItem>
                          <SelectItem value="contrato">Contrato</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="data-emissao">Data de emissão do título</Label>
                      <Input
                        id="data-emissao"
                        type="date"
                        onChange={(e) => handleChange("dataEmissao", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="data-vencimento">Data de vencimento</Label>
                      <Input
                        id="data-vencimento"
                        type="date"
                        onChange={(e) => handleChange("dataVencimento", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="valor-titulo">Valor do título</Label>
                      <Input
                        id="valor-titulo"
                        type="number"
                        step="0.01"
                        onChange={(e) => handleChange("valorTitulo", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="descricao-titulo">Descrição detalhada do título</Label>
                      <Textarea
                        id="descricao-titulo"
                        onChange={(e) => handleChange("descricaoTitulo", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
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
            {/* Pedidos específicos para cada tipo de petição */}
            {petitionType === "trabalhista" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Pedidos - Trabalhista
                </h2>
                
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
            )}
            
            {petitionType === "indenizatoria" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Pedidos - Indenizatória
                </h2>
                
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
                    <Label htmlFor="valor-danos-esteticos">Valor da indenização por danos estéticos (se aplicável)</Label>
                    <Input
                      id="valor-danos-esteticos"
                      type="number"
                      step="0.01"
                      onChange={(e) => handleChange("valorDanoEstetico", e.target.value)}
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
                </div>
              </div>
            )}
            
            {petitionType === "divorcio" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Pedidos - Divórcio
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Retorno ao nome de solteiro?</Label>
                    <RadioGroup
                      onValueChange={(value) => handleChange("retornoNomeSolteiro", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="nome-solteiro-sim" />
                        <Label htmlFor="nome-solteiro-sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="nome-solteiro-nao" />
                        <Label htmlFor="nome-solteiro-nao">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nome-retorno">Nome que deseja retornar (se aplicável)</Label>
                    <Input
                      id="nome-retorno"
                      onChange={(e) => handleChange("nomeRetorno", e.target.value)}
                    />
                  </div>
                  
                  {formData.possuiFilhos === "sim" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="guarda-filhos">Guarda dos filhos</Label>
                        <Select
                          onValueChange={(value) => handleChange("guardaFilhos", value)}
                        >
                          <SelectTrigger id="guarda-filhos">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compartilhada">Compartilhada</SelectItem>
                            <SelectItem value="unilateral-requerente">Unilateral (Requerente)</SelectItem>
                            <SelectItem value="unilateral-conjuge">Unilateral (Cônjuge)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="visitas">Regime de visitas</Label>
                        <Textarea
                          id="visitas"
                          onChange={(e) => handleChange("regimeVisitas", e.target.value)}
                          placeholder="Detalhe como serão as visitas"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="alimentos">Pensão alimentícia para os filhos</Label>
                        <Textarea
                          id="alimentos"
                          onChange={(e) => handleChange("pensaoAlimenticia", e.target.value)}
                          placeholder="Valor e forma de pagamento"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {petitionType === "habeas-corpus" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Pedidos - Habeas Corpus
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="argumentos-liminar">Argumentos para concessão da liminar</Label>
                    <Textarea
                      id="argumentos-liminar"
                      onChange={(e) => handleChange("argumentosLiminar", e.target.value)}
                      placeholder="Explique os motivos de urgência para a concessão da liminar"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="provas">Provas que possui da ilegalidade</Label>
                    <Textarea
                      id="provas"
                      onChange={(e) => handleChange("provasIlegalidade", e.target.value)}
                      placeholder="Descreva as provas que serão anexadas"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pedidos-adicionais">Pedidos adicionais</Label>
                    <Textarea
                      id="pedidos-adicionais"
                      onChange={(e) => handleChange("pedidosAdicionais", e.target.value)}
                      placeholder="Informe se há outros pedidos além da liberação do paciente"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {petitionType === "execucao" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Pedidos - Execução de Título Extrajudicial
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="valor-atualizado">Valor atualizado da execução</Label>
                    <Input
                      id="valor-atualizado"
                      type="number"
                      step="0.01"
                      onChange={(e) => handleChange("valorAtualizado", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="juros">Juros aplicados</Label>
                    <Input
                      id="juros"
                      onChange={(e) => handleChange("jurosAplicados", e.target.value)}
                      placeholder="Ex: 1% ao mês desde o vencimento"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="multa">Multa contratual (se aplicável)</Label>
                    <Input
                      id="multa"
                      onChange={(e) => handleChange("multaContratual", e.target.value)}
                      placeholder="Ex: 2% sobre o valor total"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bens-penhoraveis">Indicação de bens penhoráveis do executado (se conhecido)</Label>
                    <Textarea
                      id="bens-penhoraveis"
                      onChange={(e) => handleChange("bensPenhoraveis", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pedidos-adicionais-execucao">Pedidos adicionais</Label>
                    <Textarea
                      id="pedidos-adicionais-execucao"
                      onChange={(e) => handleChange("pedidosAdicionaisExecucao", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={handlePreviousStep}>
                Voltar
              </Button>
              <Button type="submit">
                Enviar Dados
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default QuestionnaireForm;
