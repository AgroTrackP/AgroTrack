"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { routes } from "@/routes"; 
import { submitNewPasswordWithToken } from "@/services/auth"; 
import { ResetPasswordFormFields } from "@/types"; 



const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .required("La nueva contraseña es obligatoria")
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
    .max(15, "La nueva contraseña no puede superar los 15 caracteres")
    .matches(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
    .matches(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .matches(/\d/, "La contraseña debe contener al menos un número")
    .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "La contraseña debe contener al menos un carácter especial"),
  confirmPassword: yup
    .string()
    .required("Confirmar contraseña es obligatorio")
    .oneOf([yup.ref("newPassword")], "Las contraseñas no coinciden"),
});

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<ResetPasswordFormFields>({ 
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      toast.error("Token de restablecimiento de contraseña no encontrado.");
      router.push(routes.login); 
    }
  }, [searchParams, router]);

  const handleValidation = async () => {
    try {
      await resetPasswordSchema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        validationError.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = await handleValidation();
    if (!isValid) return;

    if (!token) {
      toast.error("No hay token de restablecimiento para procesar.");
      return;
    }

    setLoading(true);

    try {

      const result = await submitNewPasswordWithToken(token, form.newPassword);

      if (result.success) {
        toast.success(result.message + " Por favor, inicia sesión.");
        router.push(routes.login); 
      } else {
        toast.error(result.message);
      }
    }    catch (err) {
        console.error("Error al restablecer la contraseña:", err);
        toast.error("Error inesperado al restablecer la contraseña.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl space-y-6 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Restablecer Contraseña
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Ingresa y confirma tu nueva contraseña.
        </p>


        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-10 bg-green-500 rounded-tr-md rounded-br-md text-white"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors?.newPassword && <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>}
        </div>


        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-10 bg-green-500 rounded-tr-md rounded-br-md text-white"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors?.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
        >
          {loading ? "Restableciendo..." : "Restablecer Contraseña"}
        </button>
      </form>
    </div>
  );
}
