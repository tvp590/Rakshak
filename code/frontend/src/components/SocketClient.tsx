import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketClient = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_IO_URL || 'ws://127.0.0.1:5001';


    const socketConnection = io(socketUrl, {
      transports: ["websocket"],
      extraHeaders: {
        'Access-Control-Allow-Credentials': 'true'
      },
      path: "/socket.io/",
    });

    setSocket(socketConnection);

    return () => {
      if (socketConnection) {
        socketConnection.disconnect();
      }
    };
  }, []);

  return socket;
};

export default SocketClient;
