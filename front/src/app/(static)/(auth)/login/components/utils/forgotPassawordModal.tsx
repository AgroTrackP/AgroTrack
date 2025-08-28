"use client";

import React, { useState, useEffect } from "react"; 
import ReactDOM from "react-dom"; 
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetPassword: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onResetPassword,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await onResetPassword(email);
      setMessage("Si el correo electrónico está registrado, se ha enviado un enlace para restablecer la contraseña.");
      setEmail("");
    } catch (error) {
      setMessage("Error al intentar restablecer la contraseña. Por favor, inténtalo de nuevo.");
      console.error("Error al solicitar reseteo de contraseña:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">
          ¿Olvidaste tu Contraseña?
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reset-email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
            </label>
            <Input
              type="email"
              id="reset-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@ejemplo.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              label="Correo Electrónico"
            />
          </div>

          {message && (
            <p className="text-sm text-center text-green-600">
                {message}
            </p>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              label="Cancelar"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-300"
            />
            <Button
              type="submit"
              label={isLoading ? "Enviando..." : "Enviar"}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
            />
          </div>
        </form>
      </div>
    </div>,
    document.body 
  );
};

export default ForgotPasswordModal; 
