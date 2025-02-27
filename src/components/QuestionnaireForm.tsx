
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import StepIndicator from "@/components/StepIndicator";
import QuestionTooltip from "@/components/QuestionTooltip";
import { supabase } from "@/integrations/supabase/client";

type AreaJuridica = 
  | "civil" 
  | "criminal" 
  | "trabalhista" 
  | "administrativo" 
  | "tributario" 
  | "previdenciario" 
  | "consumidor"
  | "outro";

type TipoPeticao = 
  | "inicial" 
  | "contestacao" 
  | "recurso" 
  | "embargo" 
  | "execucao"
  | "outro";

interface DadosQuestionario {
  cliente: {
    nome: string;
    cpf: string;
    endereco: string;
    contato: string;
  };
  areaJuridica: AreaJuridica;
  tipoPeticao: TipoPeticao;
  casoPrazo: string;
  fatos: string;
  pedidos: string;
  detalhesAdicionais: string;
  urgencia: "baixa" | "media" | "alta";
}

declare global {
  interface Window {
    enviarMensagemParaChat: (mensagem: string) => void;
  }
}

const QuestionnaireForm = () => {
  const [passo, setPasso] = useState(1);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [dadosQuestionario, setDadosQuestionario] = useState<DadosQuestionario>({
    cliente: {
      nome: "",
      cpf: "",
      endereco: "",
      contato: "",
    },
    areaJuridica: "civil",
    tipoPeticao: "inicial",
    casoPrazo: "",
    fatos: "",
    pedidos: "",
    detalhesAdicionais: "",
    urgencia: "media",
  });

  const passoAnterior = () => {
    if (passo > 1) setPasso(passo - 1);
  };

  const proximoPasso = () => {
    if (passo < 4) setPasso(passo + 1);
    else revisarDados();
  };

  const atualizarDadosCliente = (campo: keyof DadosQuestionario["cliente"], valor: string) => {
    setDadosQuestionario({
      ...dadosQuestionario,
      cliente: {
        ...dadosQuestionario.cliente,
        [campo]: valor,
      },
    });
  };

  const atualizarDadosGerais = (campo: keyof DadosQuestionario, valor: any) => {
    setDadosQuestionario({
      ...dadosQuestionario,
      [campo]: valor,
    });
  };

  const revisarDados = () => {
    setConfirmacaoAberta(true);
  };

  const confirmarEnvio = async () => {
    setConfirmacaoAberta(false);
    
    try {
      // Criar ID único para a petição
      const peticaoId = crypto.randomUUID();
      
      // Salvar dados no Supabase
      await supabase
        .from("conversations")
        .insert([
          {
            id: peticaoId,
            title: `Petição ${dadosQuestionario.tipoPeticao} - ${dadosQuestionario.cliente.nome}`,
            context: JSON.stringify(dadosQuestionario),
          },
        ]);
      
      // Formatar dados para enviar para o chat
      const mensagemFormatada = `
Preciso de uma petição com os seguintes detalhes:

ÁREA JURÍDICA: ${getAreaJuridicaTexto(dadosQuestionario.areaJuridica)}
TIPO DE PETIÇÃO: ${getTipoPeticaoTexto(dadosQuestionario.tipoPeticao)}
PARTE: ${dadosQuestionario.cliente.nome} - CPF: ${dadosQuestionario.cliente.cpf}
ENDEREÇO: ${dadosQuestionario.cliente.endereco}
CONTATO: ${dadosQuestionario.cliente.contato}
${dadosQuestionario.casoPrazo ? `PRAZO: ${dadosQuestionario.casoPrazo}` : ''}
URGÊNCIA: ${getUrgenciaTexto(dadosQuestionario.urgencia)}

FATOS:
${dadosQuestionario.fatos}

PEDIDOS:
${dadosQuestionario.pedidos}

DETALHES ADICIONAIS:
${dadosQuestionario.detalhesAdicionais}
      `;
      
      // Enviar para o chat
      if (window.enviarMensagemParaChat) {
        window.enviarMensagemParaChat(mensagemFormatada);
      }
      
      // Limpar formulário
      setDadosQuestionario({
        cliente: {
          nome: "",
          cpf: "",
          endereco: "",
          contato: "",
        },
        areaJuridica: "civil",
        tipoPeticao: "inicial",
        casoPrazo: "",
        fatos: "",
        pedidos: "",
        detalhesAdicionais: "",
        urgencia: "media",
      });
      
      setPasso(1);
      
    } catch (erro) {
      console.error("Erro ao enviar dados:", erro);
    }
  };

  function getAreaJuridicaTexto(area: AreaJuridica): string {
    const mapeamento: Record<AreaJuridica, string> = {
      civil: "Direito Civil",
      criminal: "Direito Criminal",
      trabalhista: "Direito Trabalhista",
      administrativo: "Direito Administrativo",
      tributario: "Direito Tributário",
      previdenciario: "Direito Previdenciário",
      consumidor: "Direito do Consumidor",
      outro: "Outra Área",
    };
    
    return mapeamento[area] || area;
  }
  
  function getTipoPeticaoTexto(tipo: TipoPeticao): string {
    const mapeamento: Record<TipoPeticao, string> = {
      inicial: "Petição Inicial",
      contestacao: "Contestação",
      recurso: "Recurso",
      embargo: "Embargos",
      execucao: "Execução",
      outro: "Outro Tipo",
    };
    
    return mapeamento[tipo] || tipo;
  }
  
  function getUrgenciaTexto(urgencia: "baixa" | "media" | "alta"): string {
    const mapeamento = {
      baixa: "Baixa",
      media: "Média",
      alta: "Alta",
    };
    
    return mapeamento[urgencia] || urgencia;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <StepIndicator currentStep={passo} totalSteps={4} />

      <motion.div
        key={`passo-${passo}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        {passo === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Informações do Cliente</h2>
            <p className="text-zinc-600 text-sm">
              Informe os dados do cliente para quem a petição será elaborada.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cliente-nome">
                  Nome Completo 
                  <QuestionTooltip content="Nome completo do cliente conforme documentos oficiais" />
                </Label>
                <Input
                  id="cliente-nome"
                  value={dadosQuestionario.cliente.nome}
                  onChange={(e) => atualizarDadosCliente("nome", e.target.value)}
                  placeholder="Ex: Maria Silva Santos"
                />
              </div>

              <div>
                <Label htmlFor="cliente-cpf">
                  CPF/CNPJ 
                  <QuestionTooltip content="Documento de identificação do cliente" />
                </Label>
                <Input
                  id="cliente-cpf"
                  value={dadosQuestionario.cliente.cpf}
                  onChange={(e) => atualizarDadosCliente("cpf", e.target.value)}
                  placeholder="Ex: 123.456.789-00"
                />
              </div>

              <div>
                <Label htmlFor="cliente-endereco">
                  Endereço 
                  <QuestionTooltip content="Endereço completo incluindo CEP" />
                </Label>
                <Input
                  id="cliente-endereco"
                  value={dadosQuestionario.cliente.endereco}
                  onChange={(e) => atualizarDadosCliente("endereco", e.target.value)}
                  placeholder="Ex: Rua ABC, 123, Bairro, Cidade-UF, CEP 12345-678"
                />
              </div>

              <div>
                <Label htmlFor="cliente-contato">
                  Contato 
                  <QuestionTooltip content="Telefone e/ou email para contato" />
                </Label>
                <Input
                  id="cliente-contato"
                  value={dadosQuestionario.cliente.contato}
                  onChange={(e) => atualizarDadosCliente("contato", e.target.value)}
                  placeholder="Ex: (11) 98765-4321 / email@exemplo.com"
                />
              </div>
            </div>
          </div>
        )}

        {passo === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Detalhes do Processo</h2>
            <p className="text-zinc-600 text-sm">
              Informe os detalhes básicos da petição a ser elaborada.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="area-juridica">
                  Área Jurídica 
                  <QuestionTooltip content="Área do direito relacionada à petição" />
                </Label>
                <Select
                  value={dadosQuestionario.areaJuridica}
                  onValueChange={(valor) => atualizarDadosGerais("areaJuridica", valor as AreaJuridica)}
                >
                  <SelectTrigger id="area-juridica">
                    <SelectValue placeholder="Selecione a área jurídica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="civil">Direito Civil</SelectItem>
                    <SelectItem value="criminal">Direito Criminal</SelectItem>
                    <SelectItem value="trabalhista">Direito Trabalhista</SelectItem>
                    <SelectItem value="administrativo">Direito Administrativo</SelectItem>
                    <SelectItem value="tributario">Direito Tributário</SelectItem>
                    <SelectItem value="previdenciario">Direito Previdenciário</SelectItem>
                    <SelectItem value="consumidor">Direito do Consumidor</SelectItem>
                    <SelectItem value="outro">Outra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tipo-peticao">
                  Tipo de Petição 
                  <QuestionTooltip content="Tipo específico de petição a ser elaborada" />
                </Label>
                <Select
                  value={dadosQuestionario.tipoPeticao}
                  onValueChange={(valor) => atualizarDadosGerais("tipoPeticao", valor as TipoPeticao)}
                >
                  <SelectTrigger id="tipo-peticao">
                    <SelectValue placeholder="Selecione o tipo de petição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inicial">Petição Inicial</SelectItem>
                    <SelectItem value="contestacao">Contestação</SelectItem>
                    <SelectItem value="recurso">Recurso</SelectItem>
                    <SelectItem value="embargo">Embargos</SelectItem>
                    <SelectItem value="execucao">Execução</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="caso-prazo">
                  Caso/Número do Processo e Prazo (se aplicável) 
                  <QuestionTooltip content="Informe o número do processo e prazo limite, se houver" />
                </Label>
                <Input
                  id="caso-prazo"
                  value={dadosQuestionario.casoPrazo}
                  onChange={(e) => atualizarDadosGerais("casoPrazo", e.target.value)}
                  placeholder="Ex: Processo nº 1234567-89.2023.8.26.0000 - Prazo: 15 dias (10/11/2023)"
                />
              </div>

              <div>
                <Label className="mb-2 block">
                  Nível de Urgência 
                  <QuestionTooltip content="Indica a prioridade do caso" />
                </Label>
                <RadioGroup 
                  value={dadosQuestionario.urgencia}
                  onValueChange={(v) => atualizarDadosGerais("urgencia", v as "baixa" | "media" | "alta")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="baixa" id="urgencia-baixa" />
                    <Label htmlFor="urgencia-baixa">Baixa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="media" id="urgencia-media" />
                    <Label htmlFor="urgencia-media">Média</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alta" id="urgencia-alta" />
                    <Label htmlFor="urgencia-alta">Alta</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {passo === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Fatos e Contexto</h2>
            <p className="text-zinc-600 text-sm">
              Descreva detalhadamente os fatos relevantes para a petição.
            </p>

            <div>
              <Label htmlFor="fatos" className="mb-2 block">
                Descrição dos Fatos 
                <QuestionTooltip content="Descreva em detalhes os acontecimentos relevantes para o caso" />
              </Label>
              <Textarea
                id="fatos"
                value={dadosQuestionario.fatos}
                onChange={(e) => atualizarDadosGerais("fatos", e.target.value)}
                placeholder="Descreva os fatos relevantes do caso..."
                className="min-h-[150px]"
              />
            </div>
          </div>
        )}

        {passo === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pedidos e Informações Adicionais</h2>
            <p className="text-zinc-600 text-sm">
              Informe os pedidos e quaisquer detalhes adicionais relevantes.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="pedidos" className="mb-2 block">
                  Pedidos 
                  <QuestionTooltip content="Liste os pedidos que deseja incluir na petição" />
                </Label>
                <Textarea
                  id="pedidos"
                  value={dadosQuestionario.pedidos}
                  onChange={(e) => atualizarDadosGerais("pedidos", e.target.value)}
                  placeholder="Liste os pedidos a serem incluídos na petição..."
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="detalhes-adicionais" className="mb-2 block">
                  Detalhes Adicionais 
                  <QuestionTooltip content="Inclua quaisquer informações adicionais relevantes" />
                </Label>
                <Textarea
                  id="detalhes-adicionais"
                  value={dadosQuestionario.detalhesAdicionais}
                  onChange={(e) => atualizarDadosGerais("detalhesAdicionais", e.target.value)}
                  placeholder="Inclua detalhes adicionais, documentos disponíveis, provas, argumentos específicos..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="mt-6 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={passoAnterior}
          disabled={passo === 1}
        >
          Voltar
        </Button>
        <Button
          type="button"
          onClick={proximoPasso}
        >
          {passo < 4 ? "Próximo" : "Revisar"}
        </Button>
      </div>

      <Dialog open={confirmacaoAberta} onOpenChange={setConfirmacaoAberta}>
        <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Revisar Informações</DialogTitle>
            <DialogDescription>
              Verifique se todas as informações estão corretas antes de enviar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Dados do Cliente</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Nome:</p>
                  <p>{dadosQuestionario.cliente.nome}</p>
                </div>
                <div>
                  <p className="font-medium">CPF/CNPJ:</p>
                  <p>{dadosQuestionario.cliente.cpf}</p>
                </div>
                <div>
                  <p className="font-medium">Endereço:</p>
                  <p>{dadosQuestionario.cliente.endereco}</p>
                </div>
                <div>
                  <p className="font-medium">Contato:</p>
                  <p>{dadosQuestionario.cliente.contato}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Detalhes do Processo</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Área Jurídica:</p>
                  <p>{getAreaJuridicaTexto(dadosQuestionario.areaJuridica)}</p>
                </div>
                <div>
                  <p className="font-medium">Tipo de Petição:</p>
                  <p>{getTipoPeticaoTexto(dadosQuestionario.tipoPeticao)}</p>
                </div>
                <div>
                  <p className="font-medium">Caso/Prazo:</p>
                  <p>{dadosQuestionario.casoPrazo || "Não informado"}</p>
                </div>
                <div>
                  <p className="font-medium">Urgência:</p>
                  <p>{getUrgenciaTexto(dadosQuestionario.urgencia)}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Fatos</h3>
              <div className="bg-zinc-50 p-3 rounded-md text-sm">
                <p className="whitespace-pre-wrap">{dadosQuestionario.fatos}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Pedidos</h3>
              <div className="bg-zinc-50 p-3 rounded-md text-sm">
                <p className="whitespace-pre-wrap">{dadosQuestionario.pedidos}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Detalhes Adicionais</h3>
              <div className="bg-zinc-50 p-3 rounded-md text-sm">
                <p className="whitespace-pre-wrap">{dadosQuestionario.detalhesAdicionais || "Nenhum detalhe adicional informado"}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmacaoAberta(false)}>
              Editar
            </Button>
            <Button onClick={confirmarEnvio}>
              Confirmar e Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionnaireForm;
