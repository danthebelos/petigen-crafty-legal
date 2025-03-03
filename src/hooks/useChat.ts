
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useChat = (peticaoId: string, contexto: string) => {
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [peticaoPronta, setPeticaoPronta] = useState(false);
  const { toast } = useToast();

  const enviarMensagem = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    const mensagemParaEnviar = e ? mensagem : mensagem;
    if (!mensagemParaEnviar.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setPeticaoPronta(false);
      
      const novaMensagemUsuario: Message = { role: "user", content: mensagemParaEnviar };
      setMensagens(prev => [...prev, novaMensagemUsuario]);
      setMensagem("");

      const instrucoes = `Gere uma petição EXTREMAMENTE FUNDAMENTADA E COMPLETA com pelo menos 7 páginas. Utilize a melhor técnica jurídica possível, seguindo estas diretrizes rigorosas:

1. FORMATAÇÃO E ESTRUTURA:
   - Utilize **negrito** para pontos importantes, termos jurídicos, artigos de lei e nomes de precedentes
   - Use *itálico* para citações diretas de doutrina, jurisprudência e trechos de legislação
   - Organize em seções claras e bem estruturadas: FATOS, FUNDAMENTOS JURÍDICOS (subdividido por temas), PRECEDENTES JUDICIAIS, PEDIDOS
   - Use numeração detalhada para os pedidos

2. FUNDAMENTAÇÃO JURÍDICA ROBUSTA:
   - Cite no mínimo 15 dispositivos legais específicos e atualizados, transcrevendo o texto legal
   - Inclua pelo menos 10 citações de jurisprudência recente e relevante, transcrevendo trechos completos de acórdãos
   - Insira no mínimo 8 citações doutrinárias de autores renomados, com referência completa à obra, edição, página
   - Desenvolva argumentação constitucional quando aplicável (princípios constitucionais relevantes)
   - Faça análise detalhada da jurisprudência atual dos tribunais superiores sobre a matéria

3. CONTEÚDO TÉCNICO-JURÍDICO:
   - Aborde todos os aspectos processuais e materiais relevantes para o caso
   - Exponha os fatos de maneira clara e conexa com os fundamentos jurídicos
   - Discuta os pressupostos processuais e condições da ação de forma técnica
   - Desenvolva argumentação detalhada sobre cada pedido, com fundamentação específica
   - Inclua memória de cálculo detalhada quando houver pedidos de condenação em valores
   - Antecipe e refute possíveis argumentos contrários

4. PEDIDO:
   - Formule todos os pedidos necessários, incluindo tutelas provisórias quando cabíveis
   - Elabore pedidos claros, específicos e juridicamente precisos
   - Inclua pedidos relativos a custas, honorários, juros e correção monetária

PRODUZA UMA PEÇA QUE PODERIA SER APRESENTADA A UM TRIBUNAL SUPERIOR, COM ARGUMENTAÇÃO TÉCNICA IMPECÁVEL E FUNDAMENTAÇÃO EXAUSTIVA.`;

      const { data, error } = await supabase.functions.invoke("chat-deepseek", {
        body: { 
          mensagem: mensagemParaEnviar, 
          contexto,
          instrucoes
        },
      });

      if (error) throw error;

      const novaMensagemAssistente: Message = {
        role: "assistant",
        content: data.resposta,
      };
      
      setMensagens(prev => [...prev, novaMensagemAssistente]);

      if (mensagens.filter(m => m.role === "assistant").length === 0) {
        setPeticaoPronta(true);
      }

      await supabase
        .from("messages")
        .insert([
          {
            conversation_id: peticaoId,
            content: mensagemParaEnviar,
            role: 'user'
          },
          {
            conversation_id: peticaoId,
            content: data.resposta,
            role: 'assistant'
          }
        ]);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mensagem,
    mensagens,
    setMensagem,
    isLoading,
    peticaoPronta,
    setPeticaoPronta,
    enviarMensagem
  };
};
