"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

const contactSchema = yup.object({
    name: yup.string().required("El nombre es obligatorio"),
    email: yup
        .string()
        .email("Correo no válido")
        .required("El correo es obligatorio"),
    message: yup.string().required("El mensaje no puede estar vacío"),
});

type FormValues = yup.InferType<typeof contactSchema>;


export default function ContactForm() {
const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.name,        // <-- mapear a lo que espera el backend
        email: values.email,
        description: values.message,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error del backend:", res.status, text);
      throw new Error("Error en el envío");
    }

    toast.success("Mensaje enviado con éxito ✅");
    resetForm();
  } catch (error) {
    console.error("detalle del error", error);
    toast.error("Hubo un error al enviar el mensaje ❌");
  }
};
return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Contáctanos</h2>

    <Formik
        initialValues={{ name: "", email: "", message: "" }}
        validationSchema={contactSchema}
        onSubmit={handleSubmit}
    >
        {({ isSubmitting }) => (
        <Form className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Nombre</label>
                <Field
                    name="name"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Tu nombre"
                />
                <ErrorMessage
                    name="name"
                    component="p"
                    className="text-red-500 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Correo</label>
                <Field
                    name="email"
                    type="email"
                    className="w-full border rounded px-3 py-2"
                    placeholder="tu@email.com"
                />
                <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Mensaje</label>
                <Field
                    as="textarea"
                    name="message"
                    rows={4}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Escribe tu mensaje..."
                />
                <ErrorMessage
                    name="message"
                    component="p"
                    className="text-red-500 text-sm"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
                {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
            </Form>
        )}
        </Formik>
    </div>
);
}