import React, { useEffect, useRef, useState } from "react";

const WS_URL = "ws://localhost:4000";

export default function ChatWS() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new window.WebSocket(WS_URL);
    wsRef.current = ws;

    console.log(ws);

    ws.onmessage = (event) => {
      setMessages((msgs) => [...msgs, `Bot: ${event.data}`]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (wsRef.current && input.trim()) {
      wsRef.current.send(input);
      setMessages((msgs) => [...msgs, `You: ${input}`]);
      setInput("");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-4 border rounded p-2 h-64 overflow-y-auto bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2 text-sm">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
