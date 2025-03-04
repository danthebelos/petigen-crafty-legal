
import { Message } from "@/hooks/useChat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { renderizarMensagem } from "@/utils/textFormatUtils";
import { useEffect, useRef } from "react";

interface MessageListProps {
  mensagens: Message[];
  isLoading: boolean;
}

const MessageList = ({ mensagens, isLoading }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages come in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensagens]);

  return (
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
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
