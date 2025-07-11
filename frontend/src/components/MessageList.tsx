import React from "react";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, className }) => {
  return (
    <div className={cn("flex-1 overflow-y-auto p-4 space-y-4", className)}>
      {messages.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No hay mensajes aún. ¡Comienza una conversación!
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-lg px-4 py-2 shadow-sm",
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <div className="text-sm font-medium mb-1">
                {message.sender === "user" ? "Tú" : "Asistente"}
              </div>
              <div className="text-sm whitespace-pre-wrap">
                {message.content}
              </div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
