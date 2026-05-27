"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname } from 'next/navigation';

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false
});

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Prevent this from running on the Next.js server during SSR
    if (typeof window === "undefined") return;

    const excludedRoutes = ['/', '/signin', '/signup'];
    const shouldConnect = !excludedRoutes.includes(pathname);

    if (!shouldConnect) {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    const ws = new WebSocket(wsUrl!);

    ws.onopen = () => {
      console.log("Global WebSocket Connected");
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("Global WebSocket Disconnected");
      setIsConnected(false);
      setSocket(null);

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







// Should you still use this if you have a Ping/Pong mechanism?
// Yes, you should absolutely use both together. They solve two completely different problems in real-time communication:
// 1. Ping/Pong is for Connection Health (Detecting "Zombie" connections)
// A standard WebSocket might remain stuck in the OPEN state even if the user's internet cable is unplugged or they lose cellular connection. Ping/Pong acts as a heartbeat mechanism. The client/server sends a "ping" and expects a "pong" within a specific timeframe. If the pong is never received, you know the connection is dead, and your code must manually trigger ws.close().
// 2. Reconnecting-WebSocket is for Lifecycle Management
// Once your Ping/Pong timeout manually closes the dead connection, the standard WebSocket is completely dead. You would normally have to write complex recursive functions to rebuild the connection, handle race conditions, and queue messages while it reconnects. This is where reconnecting-websocket steps in.




// import ReconnectingWebSocket from 'reconnecting-websocket';

// // 1. Initialize the WebSocket 
// const ws = new ReconnectingWebSocket('wss://your-websocket-url.com', [], {
//   maxReconnectAttempts: null, // Infinite retries
//   reconnectInterval: 1000,   // Wait 1s before first retry
//   maxReconnectDelay: 30000,  // Max wait of 30s for backoff
// });

// // 2. Add event listeners (Exactly like the standard API)
// ws.addEventListener('open', () => {
//   console.log('Connected!');
//   ws.send('Hello Server!');
// });

// ws.addEventListener('message', (event) => {
//   console.log('Message from server: ', event.data);
// });











// import ReconnectingWebSocket from 'reconnecting-websocket';

// // Replace standard 'WebSocket' with 'ReconnectingWebSocket'
// const rws = new ReconnectingWebSocket('ws://your-websocket-server.com');

// // Event listeners work exactly the same
// rws.addEventListener('open', () => {
//     console.log('Successfully connected!');
//     rws.send('Hello server!');
// });

// rws.addEventListener('message', (event) => {
//     console.log('Received message:', event.data);
// });

// rws.addEventListener('close', () => {
//     console.log('Connection lost. Library will automatically reconnect...');
// });
