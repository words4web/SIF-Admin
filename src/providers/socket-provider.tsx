"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "@/lib/axiosInstance";
import { registerAllSocketListeners } from "@/listeners/socket";
import { useAuth } from "@/hooks/useAuth";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

const socketUrl = API_BASE_URL?.replace("/api/v1", "");

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, ready } = useAuth();

  const connectSocket = () => {
    if (socketRef.current) return;

    const newSocket = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      registerAllSocketListeners(newSocket, queryClient, router);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  };

  const shouldConnect = ready && !!user;

  useEffect(() => {
    if (shouldConnect) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [shouldConnect]);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
