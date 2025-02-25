
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, FileDown } from "lucide-react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

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

      const { data, error } = await supabase.functions.invoke("chat-deepseek", {
        body: { mensagem: mensagemParaEnviar, contexto },
      });

      if (error) throw error;

      const novaMensagemAssistente: Message = {
        role: "assistant",
        content: data.resposta,
      };
      
      setMensagens(mensagens => [...mensagens, novaMensagemAssistente]);

      // Se for a primeira mensagem do assistente, assumimos que é a petição inicial
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
      // Pegar a última resposta do assistente (que deve ser a petição final)
      const peticaoFinal = mensagens
        .filter(m => m.role === "assistant")
        .pop();

      if (!peticaoFinal) {
        throw new Error("Nenhuma petição encontrada");
      }

      // Criar o documento Word
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO",
                heading: HeadingLevel.HEADING_1,
                spacing: {
                  after: 400,
                },
                alignment: "center",
              }),
              ...peticaoFinal.content
                .split("\n")
                .filter(linha => linha.trim())
                .map(
                  linha =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: linha,
                          size: 24, // 12pt
                        }),
                      ],
                      spacing: {
                        after: 200,
                      },
                    })
                ),
            ],
          },
        ],
      });

      // Gerar o arquivo
      const buffer = await Packer.toBlob(doc);
      const url = URL.createObjectURL(buffer);
      
      // Criar link para download
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
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
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
