"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaReply, FaTimes } from "react-icons/fa";

interface IMessage {
  id: string;
  email: string;
  description: string;
  createdAt: string;
}

interface MessagesClientProps {
  messages: IMessage[];
  token: string; // token JWT desde el contexto
}

export default function MessagesClient({ messages: initialMessages, token }: MessagesClientProps) {
  const [messages, setMessages] = useState<IMessage[]>(initialMessages);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState<string>("");

  const handleSendReply = async (id: string, email: string) => {
    try {
      const res = await fetch(`https://agrotrack-develop.onrender.com/contact/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          id, // id del mensaje para marcar isActive=false
          title: "Respuesta desde AgroTrack",
          email,
          description: replyMessage,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error del backend:", res.status, text);
        throw new Error("Error al enviar la respuesta");
      }

      toast.success("Respuesta enviada con éxito ✅");
      setReplyingId(null);
      setReplyMessage("");

      // Actualizamos los mensajes localmente, filtrando los que ya respondimos
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (error) {
      console.error("Error al enviar respuesta:", error);
      toast.error("Error al enviar la respuesta ❌");
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className="border rounded-lg p-4 bg-white shadow relative">
          <p><strong>Email:</strong> {msg.email}</p>
          <p><strong>Fecha:</strong> {new Date(msg.createdAt).toLocaleString()}</p>
          <p><strong>Descripción:</strong> {msg.description}</p>

          {replyingId === msg.id ? (
            <div className="mt-2 flex flex-col space-y-2">
              <textarea
                rows={3}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full border rounded px-2 py-1"
                placeholder="Escribe tu respuesta..."
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSendReply(msg.id, msg.email)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Enviar
                </button>
                <button
                  onClick={() => { setReplyingId(null); setReplyMessage(""); }}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setReplyingId(msg.id)}
              className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <FaReply /> <span>Responder</span>
            </button>
          )}
        </div>
      ))}
      {messages.length === 0 && (
        <p className="text-gray-500 text-center">No hay mensajes pendientes.</p>
      )}
    </div>
  );
}
