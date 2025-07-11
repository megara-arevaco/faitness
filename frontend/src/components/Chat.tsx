import React, { useState } from "react";
import MessageList from "./MessageList";
import type { Message } from "./MessageList";
import ChatInput from "./ChatInput";
import { cn } from "@/lib/utils";

interface ChatProps {
  className?: string;
}

const Chat: React.FC<ChatProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simular respuesta del LLM
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Hola! Recibí tu mensaje: "${content}". Esta es una respuesta simulada del LLM. En una implementación real, aquí se conectaría con un servicio de IA como OpenAI, Anthropic Claude, o un LLM local.`,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full border rounded-lg bg-background",
        className
      )}
    >
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Chat con LLM</h2>
          <p className="text-sm text-muted-foreground">
            Conversa con un asistente de inteligencia artificial
          </p>
        </div>

        <MessageList messages={messages} />

        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder={
            isLoading ? "Esperando respuesta..." : "Escribe tu mensaje..."
          }
        />
      </div>
    </div>
  );
};

export default Chat;
