import { useState } from "react";
import { motion } from "framer-motion";
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

type TipoPeticao = "inicial" | "recurso" | "execucao" | "trabalhista" | "consumidor" | "";

interface FormData {
  // Campos básicos
  tipoPeticao: TipoPeticao;
  nome: string;
  email: string;
  telefone: string;
  comarca: string;
  vara: string;
  valorCausa: string;
  
  // Campos específicos - Trabalhista
  periodoTrabalho: string;
  cargo: string;
  salario: string;
  horasExtras: boolean;
  adicionalNoturno: boolean;
  insalubridade: boolean;
  periculosidade: boolean;
  verbasRescisorias: boolean;
  detalhesViolacoes: string;
  
  // Campos específicos - Consumidor
  tipoRelacaoConsumo: string;
  dataOcorrencia: string;
  produtoServico: string;
  valorProduto: string;
  descricaoProblema: string;
  tentativaConciliacao: boolean;
  protocoloReclamacao: string;
  danosMorais: boolean;
  danosMateriais: boolean;
  valorDanosMateriais: string;
  
  // Campos específicos - Recurso
  numeroProcesso: string;
  tipoRecurso: string;
  razoesRecurso: string;
  
  // Campos específicos - Execução
  tituloExecutivo: string;
  valorExecucao: string;
  bensExecutados: string;
  
  // Campos comuns para todas as petições
  descricaoFatos: string;
  fundamentacaoJuridica: string;
  pedidos: string;
}

const QuestionnaireForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tipoPeticao: "",
    nome: "",
    email: "",
    telefone: "",
    comarca: "",
    vara: "",
    valorCausa: "",
    
    // Inicialização dos campos trabalhistas
    periodoTrabalho: "",
    cargo: "",
    salario: "",
    horasExtras: false,
    adicionalNoturno: false,
    insalubridade: false,
    periculosidade: false,
    verbasRescisorias: false,
    detalhesViolacoes: "",
    
    // Inicialização dos campos do consumidor
    tipoRelacaoConsumo: "",
    dataOcorrencia: "",
    produtoServico: "",
    valorProduto: "",
    descricaoProblema: "",
    tentativaConciliacao: false,
    protocoloReclamacao: "",
    danosMorais: false,
    danosMateriais: false,
    valorDanosMateriais: "",
    
    // Inicialização dos campos de recurso
    numeroProcesso: "",
    tipoRecurso: "",
    razoesRecurso: "",
    
    // Inicialização dos campos de execução
    tituloExecutivo: "",
    valorExecucao: "",
    bensExecutados: "",
    
    descricaoFatos: "",
    fundamentacaoJuridica: "",
    pedidos: "",
  });

  const variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

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

  const handleCheckboxChange = (name: keyof FormData) => {
    setFormData({
      ...formData,
      [name]: !formData[name],
    });
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFormSubmit();
    }
  };

  const handleFormSubmit = () => {
    setIsCompleted(true);
    
    let contexto = `Tipo de Petição: ${formData.tipoPeticao}\n`;
    contexto += `Nome: ${formData.nome}\n`;
    contexto += `Email: ${formData.email}\n`;
    contexto += `Telefone: ${formData.telefone}\n`;

    // Adicionar informações específicas baseadas no tipo de petição
    switch (formData.tipoPeticao) {
      case "trabalhista":
        contexto += `\nInformações Trabalhistas:\n`;
        contexto += `Período de Trabalho: ${formData.periodoTrabalho}\n`;
        contexto += `Cargo: ${formData.cargo}\n`;
        contexto += `Salário: ${formData.salario}\n`;
        contexto += `Horas Extras: ${formData.horasExtras ? "Sim" : "Não"}\n`;
        contexto += `Adicional Noturno: ${formData.adicionalNoturno ? "Sim" : "Não"}\n`;
        contexto += `Insalubridade: ${formData.insalubridade ? "Sim" : "Não"}\n`;
        contexto += `Periculosidade: ${formData.periculosidade ? "Sim" : "Não"}\n`;
        contexto += `Verbas Rescisórias: ${formData.verbasRescisorias ? "Sim" : "Não"}\n`;
        contexto += `\nDetalhes das Violações:\n${formData.detalhesViolacoes}`;
        break;

      case "consumidor":
        contexto += `\nInformações do Direito do Consumidor:\n`;
        contexto += `Tipo de Relação de Consumo: ${formData.tipoRelacaoConsumo}\n`;
        contexto += `Data da Ocorrência: ${formData.dataOcorrencia}\n`;
        contexto += `Produto/Serviço: ${formData.produtoServico}\n`;
        contexto += `Valor do Produto: ${formData.valorProduto}\n`;
        contexto += `Tentativa de Conciliação: ${formData.tentativaConciliacao ? "Sim" : "Não"}\n`;
        contexto += `Protocolo de Reclamação: ${formData.protocoloReclamacao}\n`;
        contexto += `Danos Morais: ${formData.danosMorais ? "Sim" : "Não"}\n`;
        contexto += `Danos Materiais: ${formData.danosMateriais ? "Sim" : "Não"}\n`;
        contexto += `Valor dos Danos Materiais: ${formData.valorDanosMateriais}\n`;
        contexto += `\nDescrição do Problema:\n${formData.descricaoProblema}`;
        break;

      case "recurso":
        contexto += `\nInformações do Recurso:\n`;
        contexto += `Número do Processo: ${formData.numeroProcesso}\n`;
        contexto += `Tipo de Recurso: ${formData.tipoRecurso}\n`;
        contexto += `\nRazões do Recurso:\n${formData.razoesRecurso}`;
        break;

      case "execucao":
        contexto += `\nInformações da Execução:\n`;
        contexto += `Título Executivo: ${formData.tituloExecutivo}\n`;
        contexto += `Valor da Execução: ${formData.valorExecucao}\n`;
        contexto += `\nBens para Execução:\n${formData.bensExecutados}`;
        break;
    }

    if (window.enviarMensagemParaChat) {
      window.enviarMensagemParaChat(contexto);
    }
  };

  const renderTipoPeticao = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
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
            <SelectItem value="trabalhista">Trabalhista</SelectItem>
            <SelectItem value="consumidor">Direito do Consumidor</SelectItem>
            <SelectItem value="recurso">Recurso</SelectItem>
            <SelectItem value="execucao">Execução</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );

  const renderInformacoesPessoais = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="nome">
          Nome Completo
          <QuestionTooltip content="Digite o nome completo do cliente" />
        </Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          placeholder="Nome completo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email
          <QuestionTooltip content="Email para contato" />
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="email@exemplo.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone">
          Telefone
          <QuestionTooltip content="Telefone para contato" />
        </Label>
        <Input
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleInputChange}
          placeholder="(00) 00000-0000"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comarca">
          Comarca
          <QuestionTooltip content="Comarca onde será ajuizada a ação" />
        </Label>
        <Input
          id="comarca"
          name="comarca"
          value={formData.comarca}
          onChange={handleInputChange}
          placeholder="Nome da comarca"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vara">
          Vara
          <QuestionTooltip content="Vara específica, se aplicável" />
        </Label>
        <Input
          id="vara"
          name="vara"
          value={formData.vara}
          onChange={handleInputChange}
          placeholder="Ex: 1ª Vara do Trabalho"
        />
      </div>
    </motion.div>
  );

  const renderDetalhesEspecificos = () => {
    switch (formData.tipoPeticao) {
      case "trabalhista":
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="periodoTrabalho">Período de Trabalho</Label>
              <Input
                id="periodoTrabalho"
                name="periodoTrabalho"
                value={formData.periodoTrabalho}
                onChange={handleInputChange}
                placeholder="Ex: 01/01/2020 a 01/01/2023"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
                placeholder="Ex: Auxiliar Administrativo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salario">Salário</Label>
              <Input
                id="salario"
                name="salario"
                value={formData.salario}
                onChange={handleInputChange}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="space-y-4">
              <Label>Direitos Violados</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="horasExtras"
                    checked={formData.horasExtras}
                    onChange={() => handleCheckboxChange("horasExtras")}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="horasExtras">Horas Extras</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="adicionalNoturno"
                    checked={formData.adicionalNoturno}
                    onChange={() => handleCheckboxChange("adicionalNoturno")}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="adicionalNoturno">Adicional Noturno</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="insalubridade"
                    checked={formData.insalubridade}
                    onChange={() => handleCheckboxChange("insalubridade")}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="insalubridade">Insalubridade</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="periculosidade"
                    checked={formData.periculosidade}
                    onChange={() => handleCheckboxChange("periculosidade")}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="periculosidade">Periculosidade</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verbasRescisorias"
                    checked={formData.verbasRescisorias}
                    onChange={() => handleCheckboxChange("verbasRescisorias")}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="verbasRescisorias">Verbas Rescisórias</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="detalhesViolacoes">
                Detalhes das Violações
                <QuestionTooltip content="Descreva detalhadamente as violações aos direitos trabalhistas" />
              </Label>
              <Textarea
                id="detalhesViolacoes"
                name="detalhesViolacoes"
                value={formData.detalhesViolacoes}
                onChange={handleInputChange}
                placeholder="Descreva as violações aos direitos trabalhistas..."
                className="min-h-[150px]"
              />
            </div>
          </motion.div>
        );

      case "consumidor":
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="tipoRelacaoConsumo">Tipo de Relação de Consumo</Label>
              <Select
                value={formData.tipoRelacaoConsumo}
                onValueChange={(value) => handleSelectChange("tipoRelacaoConsumo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de relação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produto">Produto</SelectItem>
                  <SelectItem value="servico">Serviço</SelectItem>
                  <SelectItem value="ambos">Produto e Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataOcorrencia">Data da Ocorrência</Label>
              <Input
                id="dataOcorrencia"
                name="dataOcorrencia"
                type="date"
                value={formData.dataOcorrencia}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="produtoServico">Produto/Serviço</Label>
              <Input
                id="produtoServico"
                name="produtoServico"
                value={formData.produtoServico}
                onChange={handleInputChange}
                placeholder="Nome do produto ou serviço"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorProduto">Valor do Produto/Serviço</Label>
              <Input
                id="valorProduto"
                name="valorProduto"
                value={formData.valorProduto}
                onChange={handleInputChange}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="tentativaConciliacao"
                  checked={formData.tentativaConciliacao}
                  onChange={() => handleCheckboxChange("tentativaConciliacao")}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="tentativaConciliacao">Tentativa de Conciliação Prévia</Label>
              </div>

              {formData.tentativaConciliacao && (
                <div className="space-y-2">
                  <Label htmlFor="protocoloReclamacao">Protocolo da Reclamação</Label>
                  <Input
                    id="protocoloReclamacao"
                    name="protocoloReclamacao"
                    value={formData.protocoloReclamacao}
                    onChange={handleInputChange}
                    placeholder="Número do protocolo"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label>Tipos de Danos</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="danosMorais"
                    checked={formData.danosMorais}
                    onChange={() => handleCheckboxChange("danosMorais")}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="danosMorais">Danos Morais</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="danosMateriais"
                    checked={formData.danosMateriais}
                    onChange={() => handleCheckboxChange("danosMateriais")}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="danosMateriais">Danos Materiais</Label>
                </div>
              </div>

              {formData.danosMateriais && (
                <div className="space-y-2">
                  <Label htmlFor="valorDanosMateriais">Valor dos Danos Materiais</Label>
                  <Input
                    id="valorDanosMateriais"
                    name="valorDanosMateriais"
                    value={formData.valorDanosMateriais}
                    onChange={handleInputChange}
                    placeholder="R$ 0,00"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricaoProblema">
                Descrição do Problema
                <QuestionTooltip content="Descreva detalhadamente o problema enfrentado" />
              </Label>
              <Textarea
                id="descricaoProblema"
                name="descricaoProblema"
                value={formData.descricaoProblema}
                onChange={handleInputChange}
                placeholder="Descreva o problema detalhadamente..."
                className="min-h-[150px]"
              />
            </div>
          </motion.div>
        );

      case "recurso":
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
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
                  <SelectItem value="especial">Recurso Especial</SelectItem>
                  <SelectItem value="extraordinario">Recurso Extraordinário</SelectItem>
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
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="tituloExecutivo">
                Título Executivo
                <QuestionTooltip content="Especifique o título executivo (judicial ou extrajudicial)" />
              </Label>
              <Select
                value={formData.tituloExecutivo}
                onValueChange={(value) => handleSelectChange("tituloExecutivo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de título" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sentenca">Sentença Judicial</SelectItem>
                  <SelectItem value="acordo">Acordo Judicial</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="nota">Nota Promissória</SelectItem>
                  <SelectItem value="duplicata">Duplicata</SelectItem>
                  <SelectItem value="contrato">Contrato</SelectItem>
                </SelectContent>
              </Select>
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
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
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
        <div>
          <span className="font-medium">Comarca:</span> {formData.comarca}
        </div>
        <div>
          <span className="font-medium">Vara:</span> {formData.vara}
        </div>
        
        {formData.tipoPeticao === "trabalhista" && (
          <>
            <div>
              <span className="font-medium">Período de Trabalho:</span> {formData.periodoTrabalho}
            </div>
            <div>
              <span className="font-medium">Cargo:</span> {formData.cargo}
            </div>
            <div>
              <span className="font-medium">Salário:</span> {formData.salario}
            </div>
            <div>
              <span className="font-medium">Direitos Violados:</span>
              <ul className="list-disc pl-5 mt-2">
                {formData.horasExtras && <li>Horas Extras</li>}
                {formData.adicionalNoturno && <li>Adicional Noturno</li>}
                {formData.insalubridade && <li>Insalubridade</li>}
                {formData.periculosidade && <li>Periculosidade</li>}
                {formData.verbasRescisorias && <li>Verbas Rescisórias</li>}
              </ul>
            </div>
            <div>
              <span className="font-medium">Detalhes das Violações:</span>
              <p className="mt-1 whitespace-pre-wrap">{formData.detalhesViolacoes}</p>
            </div>
          </>
        )}

        {formData.tipoPeticao === "consumidor" && (
          <>
            <div>
              <span className="font-medium">Tipo de Relação:</span> {formData.tipoRelacaoConsumo}
            </div>
            <div>
              <span className="font-medium">Data da Ocorrência:</span> {formData.dataOcorrencia}
            </div>
            <div>
              <span className="font-medium">Produto/Serviço:</span>
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <StepIndicator currentStep={currentStep} steps={steps} />
      
      <div className="mt-8">
        {currentStep === 0 && renderTipoPeticao()}
        {currentStep === 1 && renderInformacoesPessoais()}
        {currentStep === 2 && renderDetalhesEspecificos()}
        {currentStep === 3 && renderRevisao()}
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>
        <Button
          type="button"
          onClick={nextStep}
        >
          {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
          {currentStep !== steps.length - 1 && (
            <ArrowRight className="w-4 h-4 ml-2" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuestionnaireForm;
