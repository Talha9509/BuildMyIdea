"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false
});

// Create the Provider Component
export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Prevent this from running on the Next.js server during SSR
    if (typeof window === "undefined") return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Global WebSocket Connected");
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("Global WebSocket Disconnected");
      setIsConnected(false);
      setSocket(null);

      // Pro Tip: If you want to auto-reconnect when their wifi drops, 
      // you would put a setTimeout here to try creating a new WebSocket!
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useGlobalWebSocket = () => {
  return useContext(WebSocketContext);
};