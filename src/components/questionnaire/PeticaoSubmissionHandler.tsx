
import { useRef, useEffect } from "react";
import { FormValues } from "@/types/questionnaire";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePeticaoContext } from "./PeticaoContext";

type Advogado = {
  id: string;
  nome_completo: string;
  oab: string;
  email: string;
  foto_url?: string;
  bio?: string;
};

interface PeticaoSubmissionHandlerProps {
  chatRef: React.RefObject<any>;
}

const PeticaoSubmissionHandler = ({ chatRef }: PeticaoSubmissionHandlerProps) => {
  const { toast } = useToast();
  const { 
    setFormData, 
    setSelectedAdvogado, 
    setPromptContext, 
    setIsFormSubmitted,
    isFormSubmitted,
    promptContext
  } = usePeticaoContext();

  const handleFormSubmit = async (data: FormValues) => {
    setFormData(data);
    
    // Buscar dados do advogado selecionado
    if (data.advogadoId) {
      try {
        const { data: advogadoData, error } = await supabase
          .from("advogados")
          .select("*")
          .eq("id", data.advogadoId)
          .single();
        
        if (error) throw error;
        setSelectedAdvogado(advogadoData as Advogado);
      } catch (error) {
        console.error("Erro ao buscar dados do advogado:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível buscar os dados do advogado selecionado.",
        });
      }
    }
    
    // Construir o endereço completo
    const endereco = data.enderecoReclamante || '';
    const complemento = data.complemento ? `, ${data.complemento}` : '';
    const bairro = data.bairro ? `, ${data.bairro}` : '';
    const cidade = data.cidade || '';
    const estado = data.estado || '';
    const cep = data.cep ? `, CEP: ${data.cep}` : '';
    
    const enderecoCompleto = `${endereco}${complemento}${bairro}, ${cidade}/${estado}${cep}`;
    
    // Construindo o prompt para enviar para o chat
    let promptContent = `Com base nas seguintes informações, gere uma petição ${data.tipo || "jurídica"} completa, extremamente bem fundamentada com no mínimo 7 páginas, incluindo citações doutrinárias e jurisprudenciais pertinentes. A petição deve seguir a formatação e estrutura adequada, com espaçamento correto e todos os elementos necessários. Inclua fundamentação legal detalhada e adequada ao caso.\n\n`;
    
    // Adicionando os dados do advogado ao prompt
    if (data.advogadoId) {
      const { data: advogadoData } = await supabase
        .from("advogados")
        .select("*")
        .eq("id", data.advogadoId)
        .single();
      
      if (advogadoData) {
        promptContent += `Advogado Responsável: ${advogadoData.nome_completo}\n`;
        promptContent += `OAB: ${advogadoData.oab}\n`;
        promptContent += `Email Profissional: ${advogadoData.email}\n`;
        if (advogadoData.bio) promptContent += `Biografia: ${advogadoData.bio}\n`;
        promptContent += `\n`;
      }
    }
    
    // Adicionando os dados do formulário ao prompt
    promptContent += `Tipo de petição: ${data.tipo}\n`;
    promptContent += `Nome do reclamante: ${data.nomeReclamante}\n`;
    promptContent += `CPF do reclamante: ${data.cpfReclamante}\n`;
    promptContent += `RG do reclamante: ${data.rgReclamante}\n`;
    promptContent += `Endereço completo: ${enderecoCompleto}\n`;
    promptContent += `Email do reclamante: ${data.emailReclamante}\n`;
    promptContent += `Telefone do reclamante: ${data.telefoneReclamante}\n\n`;
    
    // Dados da empresa
    promptContent += `Nome da empresa reclamada: ${data.nomeReclamada}\n`;
    promptContent += `Razão social da reclamada: ${data.razaoSocialReclamada}\n`;
    promptContent += `CNPJ da reclamada: ${data.cnpjReclamada}\n`;
    promptContent += `Endereço da reclamada: ${data.enderecoReclamada}\n`;
    promptContent += `Email da reclamada: ${data.emailReclamado}\n`;
    promptContent += `Telefone da reclamada: ${data.telefoneReclamado}\n\n`;
    
    // Informações principais do caso
    promptContent += `Descrição dos fatos: ${data.descricaoFatos}\n`;
    if (data.argumentos) promptContent += `Argumentos adicionais: ${data.argumentos}\n`;
    if (data.pedidos) promptContent += `Pedidos específicos: ${data.pedidos}\n`;
    
    // Verbas trabalhistas selecionadas
    if (data.verbasTrabalhistas && data.verbasTrabalhistas.length > 0) {
      promptContent += `\nVerbas trabalhistas solicitadas:\n`;
      data.verbasTrabalhistas.forEach((verba: string) => {
        promptContent += `- ${verba}\n`;
      });
    }
    
    // Opções selecionadas
    promptContent += `\nOpções selecionadas:`;
    promptContent += `\n- Juízo 100% Digital: ${data.juizoDigital ? "Sim" : "Não"}`;
    promptContent += `\n- Solicita Justiça Gratuita: ${data.solicitaJusticaGratuita ? "Sim" : "Não"}`;
    
    console.log("Enviando dados para o chat:", promptContent);
    
    // Definir o contexto para o chat
    setPromptContext(promptContent);
    
    // Marcar o formulário como enviado para exibir o chat
    setIsFormSubmitted(true);
    
    toast({
      title: "Dados enviados para o chat",
      description: "Sua petição está sendo gerada automaticamente",
    });
  };

  return { handleFormSubmit };
};

export default PeticaoSubmissionHandler;
