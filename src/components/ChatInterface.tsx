
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, FileDown } from "lucide-react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Bold, Italic } from "docx";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  peticaoId: string;
  contexto: string;
}

declare global {
  interface Window {
    enviarMensagemParaChat: (mensagem: string) => void;
  }
}

const ChatInterface = ({ peticaoId, contexto }: ChatInterfaceProps) => {
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [peticaoPronta, setPeticaoPronta] = useState(false);
  const { toast } = useToast();

  const formatarTexto = (texto: string) => {
    // Substitui **texto** por <strong>texto</strong> para negrito
    texto = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Substitui *texto* por <em>texto</em> para itálico
    texto = texto.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return texto;
  };

  const renderizarMensagem = (content: string) => {
    return <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatarTexto(content) }} />;
  };

  const processarTextoParaDocumentoWord = (texto: string) => {
    // Dividir o texto em parágrafos
    const paragrafos = texto.split('\n\n');
    
    return paragrafos.map(paragrafo => {
      // Verificar se é um título (todo em maiúsculas)
      const ehTitulo = paragrafo.trim() === paragrafo.trim().toUpperCase() && paragrafo.trim().length > 3;
      
      // Processar formatação de negrito e itálico
      const segmentos = [];
      let ultimoIndice = 0;
      
      // Processar negrito
      const regexNegrito = /\*\*(.*?)\*\*/g;
      let matchNegrito;
      while ((matchNegrito = regexNegrito.exec(paragrafo)) !== null) {
        // Adicionar texto antes do negrito
        if (matchNegrito.index > ultimoIndice) {
          segmentos.push(
            new TextRun({
              text: paragrafo.substring(ultimoIndice, matchNegrito.index),
              size: ehTitulo ? 28 : 24,
              bold: ehTitulo,
            })
          );
        }
        
        // Adicionar texto em negrito
        segmentos.push(
          new TextRun({
            text: matchNegrito[1], // O texto dentro dos asteriscos
            size: ehTitulo ? 28 : 24,
            bold: true,
          })
        );
        
        ultimoIndice = matchNegrito.index + matchNegrito[0].length;
      }
      
      // Processar itálico no texto restante
      const textoRestante = paragrafo.substring(ultimoIndice);
      const regexItalico = /\*(.*?)\*/g;
      let ultimoIndiceItalico = 0;
      let matchItalico;
      
      const segmentosRestantes = [];
      
      while ((matchItalico = regexItalico.exec(textoRestante)) !== null) {
        // Adicionar texto antes do itálico
        if (matchItalico.index > ultimoIndiceItalico) {
          segmentosRestantes.push(
            new TextRun({
              text: textoRestante.substring(ultimoIndiceItalico, matchItalico.index),
              size: ehTitulo ? 28 : 24,
              bold: ehTitulo,
            })
          );
        }
        
        // Adicionar texto em itálico
        segmentosRestantes.push(
          new TextRun({
            text: matchItalico[1], // O texto dentro dos asteriscos
            size: ehTitulo ? 28 : 24,
            italic: true,
          })
        );
        
        ultimoIndiceItalico = matchItalico.index + matchItalico[0].length;
      }
      
      // Adicionar texto final se houver
      if (ultimoIndiceItalico < textoRestante.length) {
        segmentosRestantes.push(
          new TextRun({
            text: textoRestante.substring(ultimoIndiceItalico),
            size: ehTitulo ? 28 : 24,
            bold: ehTitulo,
          })
        );
      }
      
      // Se não houver formatação, adicionar o texto completo
      if (segmentos.length === 0 && segmentosRestantes.length === 0) {
        segmentos.push(
          new TextRun({
            text: paragrafo,
            size: ehTitulo ? 28 : 24,
            bold: ehTitulo,
          })
        );
      } else if (segmentosRestantes.length > 0) {
        segmentos.push(...segmentosRestantes);
      }
      
      return new Paragraph({
        children: segmentos,
        spacing: {
          after: 400,
          before: ehTitulo ? 400 : 200,
        },
        alignment: ehTitulo ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
      });
    });
  };

  const gerarDocumentoWord = async (texto: string) => {
    const paragrafos = processarTextoParaDocumentoWord(texto);
    
    return new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO",
                  size: 28,
                  bold: true,
                }),
              ],
              spacing: { after: 400 },
              alignment: AlignmentType.CENTER,
            }),
            ...paragrafos,
          ],
        },
      ],
    });
  };

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
      setMensagens([...mensagens, novaMensagemUsuario]);
      setMensagem("");

      const instrucoes = `Gere uma petição extremamente fundamentada e extensa, com pelo menos 10 páginas. Inclua:
      1. Todos os aspectos legais relevantes, incluindo legislação completa e atualizada, jurisprudência dos Tribunais Superiores (STF e STJ), doutrina de autores renomados com citações diretas
      2. Utilize **negrito** para pontos importantes, termos jurídicos, artigos de lei e nomes de precedentes
      3. Use *itálico* para citações diretas de doutrina, jurisprudência e trechos de legislação
      4. Organize em seções claras e bem estruturadas: FATOS, FUNDAMENTOS JURÍDICOS (subdividido por temas), PRECEDENTES JUDICIAIS, PEDIDOS
      5. Use numeração detalhada para os pedidos
      6. Inclua pelo menos 5 citações de jurisprudência recente e relevante com ementa completa
      7. Faça referência específica a pelo menos 15 artigos diferentes de leis aplicáveis
      8. Fundamente cada argumento com pelo menos uma fonte doutrinária, uma fonte jurisprudencial e embasamento legal
      9. Inclua argumentação profunda sobre a constitucionalidade da questão quando relevante
      10. Mencione princípios jurídicos aplicáveis ao caso com fundamentação constitucional`;

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
      
      setMensagens(mensagens => [...mensagens, novaMensagemAssistente]);

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

  const handleFinalizarPeticao = async () => {
    try {
      const peticaoFinal = mensagens
        .filter(m => m.role === "assistant")
        .pop();

      if (!peticaoFinal) {
        throw new Error("Nenhuma petição encontrada");
      }

      const doc = await gerarDocumentoWord(peticaoFinal.content);
      const buffer = await Packer.toBlob(doc);
      const url = URL.createObjectURL(buffer);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = "peticao.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Sucesso!",
        description: "Petição gerada com sucesso!",
      });

    } catch (error) {
      console.error("Erro ao gerar documento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar o documento. Tente novamente.",
      });
    }
  };

  useEffect(() => {
    window.enviarMensagemParaChat = (mensagemExterna: string) => {
      setMensagem(mensagemExterna);
      setTimeout(() => {
        enviarMensagem();
      }, 100);
    };
  }, []);

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-sm">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {mensagens.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-900"
                }`}
              >
                {renderizarMensagem(msg.content)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-4">
        {peticaoPronta && (
          <Button
            onClick={handleFinalizarPeticao}
            className="w-full flex items-center justify-center gap-2"
            variant="default"
          >
            <FileDown className="h-4 w-4" />
            Finalizar e Gerar Petição
          </Button>
        )}
        
        <form onSubmit={enviarMensagem} className="flex gap-2">
          <Input
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
