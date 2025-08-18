"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaComments } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

export default function FloatingChatBot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

  // Mensaje inicial del bot cuando se abre
    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([
        {
            role: "assistant",
            content:
            "¡Hola! Soy AgroBot 🌱, tu asistente virtual. Te puedo ayudar a conocer los planes de AgroTrack y encontrar el ideal para vos. ¿Querés que te cuente los precios?",
        },
    ]);
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [open]);

const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
        const res = await axios.post("/api/chat", {
        message: input,
    });
        setMessages([
            ...newMessages,
            { role: "assistant", content: res.data.reply },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        setMessages([
        ...newMessages,
        { role: "assistant", content: "Uy, hubo un error al responder 😅." },
    ]);
    }

    setLoading(false);
};

return (
    <>
      {/* botón flotante */}
    <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
    >
        {open ? <IoMdClose size={24} /> : <FaComments size={24} />}
    </button>

      {/* ventana del chat */}
    {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-lg border flex flex-col">
        <div className="p-3 bg-green-600 text-white rounded-t-lg font-bold">
            AgroBot 🌱
        </div>
        <div className="flex-1 p-3 overflow-y-auto h-64 flex flex-col">
            {messages.map((m, i) => (
            <div
                key={i}
                className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                m.role === "user"
                    ? "bg-green-100 self-end ml-auto"
                    : "bg-gray-100 self-start mr-auto"
                }`}
            >
                {m.content}
            </div>
            ))}
            {loading && (
            <div className="text-gray-500 text-sm">Escribiendo...</div>
            )}
        </div>
        <div className="flex border-t">
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 p-2 outline-none"
                placeholder="Escribe un mensaje..."
            />
            <button
                onClick={sendMessage}
                className="bg-green-600 text-white px-4 hover:bg-green-700"
            >
            ➤
            </button>
        </div>
        </div>
    )}
    </>
);
}