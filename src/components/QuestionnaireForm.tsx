
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StepIndicator from "./StepIndicator";
import QuestionTooltip from "./QuestionTooltip";
import { ArrowLeft, ArrowRight } from "lucide-react";

const steps = [
  "Tipo de Petição",
  "Informações Pessoais",
  "Detalhes Específicos",
  "Revisão",
];

type TipoPeticao = "inicial" | "recurso" | "execucao" | "";

interface FormData {
  tipoPeticao: TipoPeticao;
  nome: string;
  email: string;
  telefone: string;
  // Campos comuns
  comarca: string;
  vara: string;
  valorCausa: string;
  // Campos específicos - Petição Inicial
  descricaoFatos: string;
  fundamentacaoJuridica: string;
  pedidos: string;
  // Campos específicos - Recurso
  numeroProcesso: string;
  tipoRecurso: string;
  razoesRecurso: string;
  // Campos específicos - Execução
  tituloExecutivo: string;
  valorExecucao: string;
  bensExecutados: string;
}

const QuestionnaireForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    tipoPeticao: "",
    nome: "",
    email: "",
    telefone: "",
    comarca: "",
    vara: "",
    valorCausa: "",
    descricaoFatos: "",
    fundamentacaoJuridica: "",
    pedidos: "",
    numeroProcesso: "",
    tipoRecurso: "",
    razoesRecurso: "",
    tituloExecutivo: "",
    valorExecucao: "",
    bensExecutados: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderTipoPeticao = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="tipoPeticao">
          Tipo de Petição
          <QuestionTooltip content="Selecione o tipo de petição que você deseja criar" />
        </Label>
        <Select
          value={formData.tipoPeticao}
          onValueChange={(value) => handleSelectChange("tipoPeticao", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de petição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inicial">Petição Inicial</SelectItem>
            <SelectItem value="recurso">Recurso</SelectItem>
            <SelectItem value="execucao">Execução</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );

  const renderInformacoesPessoais = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="nome">
          Nome Completo
          <QuestionTooltip content="Digite seu nome completo como consta em documentos oficiais" />
        </Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          placeholder="João da Silva"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email
          <QuestionTooltip content="Seu email principal para contato" />
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="joao@email.com"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone">
          Telefone
          <QuestionTooltip content="Número de telefone com DDD" />
        </Label>
        <Input
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleInputChange}
          placeholder="(11) 99999-9999"
          className="w-full"
        />
      </div>
    </motion.div>
  );

  const renderDetalhesEspecificos = () => {
    switch (formData.tipoPeticao) {
      case "inicial":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="comarca">Comarca</Label>
              <Input
                id="comarca"
                name="comarca"
                value={formData.comarca}
                onChange={handleInputChange}
                placeholder="Ex: São Paulo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vara">Vara</Label>
              <Input
                id="vara"
                name="vara"
                value={formData.vara}
                onChange={handleInputChange}
                placeholder="Ex: 1ª Vara Cível"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorCausa">Valor da Causa</Label>
              <Input
                id="valorCausa"
                name="valorCausa"
                value={formData.valorCausa}
                onChange={handleInputChange}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricaoFatos">
                Descrição dos Fatos
                <QuestionTooltip content="Descreva detalhadamente os fatos que fundamentam seu pedido" />
              </Label>
              <Textarea
                id="descricaoFatos"
                name="descricaoFatos"
                value={formData.descricaoFatos}
                onChange={handleInputChange}
                placeholder="Descreva os fatos relevantes..."
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fundamentacaoJuridica">
                Fundamentação Jurídica
                <QuestionTooltip content="Indique as leis e jurisprudências que fundamentam seu pedido" />
              </Label>
              <Textarea
                id="fundamentacaoJuridica"
                name="fundamentacaoJuridica"
                value={formData.fundamentacaoJuridica}
                onChange={handleInputChange}
                placeholder="Digite a fundamentação jurídica..."
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pedidos">
                Pedidos
                <QuestionTooltip content="Liste todos os pedidos que deseja fazer ao juízo" />
              </Label>
              <Textarea
                id="pedidos"
                name="pedidos"
                value={formData.pedidos}
                onChange={handleInputChange}
                placeholder="Liste seus pedidos..."
                className="min-h-[150px]"
              />
            </div>
          </motion.div>
        );

      case "recurso":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="numeroProcesso">
                Número do Processo
                <QuestionTooltip content="Número do processo original" />
              </Label>
              <Input
                id="numeroProcesso"
                name="numeroProcesso"
                value={formData.numeroProcesso}
                onChange={handleInputChange}
                placeholder="0000000-00.0000.0.00.0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoRecurso">
                Tipo de Recurso
                <QuestionTooltip content="Selecione o tipo de recurso adequado" />
              </Label>
              <Select
                value={formData.tipoRecurso}
                onValueChange={(value) => handleSelectChange("tipoRecurso", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de recurso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apelacao">Apelação</SelectItem>
                  <SelectItem value="agravo">Agravo de Instrumento</SelectItem>
                  <SelectItem value="embargos">Embargos de Declaração</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="razoesRecurso">
                Razões do Recurso
                <QuestionTooltip content="Apresente os argumentos do seu recurso" />
              </Label>
              <Textarea
                id="razoesRecurso"
                name="razoesRecurso"
                value={formData.razoesRecurso}
                onChange={handleInputChange}
                placeholder="Digite as razões do recurso..."
                className="min-h-[200px]"
              />
            </div>
          </motion.div>
        );

      case "execucao":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="tituloExecutivo">
                Título Executivo
                <QuestionTooltip content="Especifique o título executivo (judicial ou extrajudicial)" />
              </Label>
              <Input
                id="tituloExecutivo"
                name="tituloExecutivo"
                value={formData.tituloExecutivo}
                onChange={handleInputChange}
                placeholder="Ex: Sentença Judicial / Nota Promissória"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorExecucao">
                Valor da Execução
                <QuestionTooltip content="Valor atualizado da execução" />
              </Label>
              <Input
                id="valorExecucao"
                name="valorExecucao"
                value={formData.valorExecucao}
                onChange={handleInputChange}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bensExecutados">
                Bens para Execução
                <QuestionTooltip content="Liste os bens indicados à penhora, se houver" />
              </Label>
              <Textarea
                id="bensExecutados"
                name="bensExecutados"
                value={formData.bensExecutados}
                onChange={handleInputChange}
                placeholder="Liste os bens para execução..."
                className="min-h-[150px]"
              />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const renderRevisao = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold">Revisão dos Dados</h3>
      <div className="space-y-4 text-sm">
        <div>
          <span className="font-medium">Tipo de Petição:</span> {formData.tipoPeticao}
        </div>
        <div>
          <span className="font-medium">Nome:</span> {formData.nome}
        </div>
        <div>
          <span className="font-medium">Email:</span> {formData.email}
        </div>
        <div>
          <span className="font-medium">Telefone:</span> {formData.telefone}
        </div>
        
        {formData.tipoPeticao === "inicial" && (
          <>
            <div>
              <span className="font-medium">Comarca:</span> {formData.comarca}
            </div>
            <div>
              <span className="font-medium">Vara:</span> {formData.vara}
            </div>
            <div>
              <span className="font-medium">Valor da Causa:</span> {formData.valorCausa}
            </div>
            <div>
              <span className="font-medium">Descrição dos Fatos:</span>
              <p className="mt-1 whitespace-pre-wrap">{formData.descricaoFatos}</p>
            </div>
          </>
        )}

        {formData.tipoPeticao === "recurso" && (
          <>
            <div>
              <span className="font-medium">Número do Processo:</span> {formData.numeroProcesso}
            </div>
            <div>
              <span className="font-medium">Tipo de Recurso:</span> {formData.tipoRecurso}
            </div>
            <div>
              <span className="font-medium">Razões do Recurso:</span>
              <p className="mt-1 whitespace-pre-wrap">{formData.razoesRecurso}</p>
            </div>
          </>
        )}

        {formData.tipoPeticao === "execucao" && (
          <>
            <div>
              <span className="font-medium">Título Executivo:</span> {formData.tituloExecutivo}
            </div>
            <div>
              <span className="font-medium">Valor da Execução:</span> {formData.valorExecucao}
            </div>
            <div>
              <span className="font-medium">Bens para Execução:</span>
              <p className="mt-1 whitespace-pre-wrap">{formData.bensExecutados}</p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderTipoPeticao();
      case 1:
        return renderInformacoesPessoais();
      case 2:
        return renderDetalhesEspecificos();
      case 3:
        return renderRevisao();
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <StepIndicator steps={steps} currentStep={currentStep} />
      
      <div className="bg-white rounded-xl shadow-sm p-8">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="flex items-center"
          >
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireForm;
