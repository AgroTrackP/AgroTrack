"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaComments } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

export default function FloatingChatBot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Ref para el contenedor de mensajes para poder hacer scroll automático
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    // Función para hacer scroll hasta el final
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Efecto para hacer scroll cada vez que los mensajes cambian
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            const res = await axios.post("https://agrotrack-develop.onrender.com/api/chat", {
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
                className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition z-50"
            >
                {open ? <IoMdClose size={24} /> : <FaComments size={24} />}
            </button>

            {/* ventana del chat */}
            {open && (
                // MODIFICACIÓN: Se añade la clase z-50 para asegurar que el chat esté por encima de otros elementos.
                <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-lg shadow-2xl border flex flex-col max-h-[70vh] z-50">
                    <div className="p-3 bg-green-600 text-white rounded-t-lg font-bold flex-shrink-0">
                        AgroBot 🌱
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto flex flex-col space-y-2">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`p-2 rounded-lg max-w-[85%] break-words ${
                                    m.role === "user"
                                        ? "bg-green-100 self-end ml-auto"
                                        : "bg-gray-100 self-start mr-auto"
                                }`}
                            >
                                {m.content}
                            </div>
                        ))}
                        {loading && (
                            <div className="text-gray-500 text-sm self-start">Escribiendo...</div>
                        )}
                        {/* Elemento invisible al que haremos scroll */}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex border-t flex-shrink-0">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            className="flex-1 p-3 outline-none rounded-bl-lg"
                            placeholder="Escribe un mensaje..."
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-green-600 text-white px-4 hover:bg-green-700 rounded-br-lg"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}