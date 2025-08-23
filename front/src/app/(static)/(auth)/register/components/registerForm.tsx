"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { RegisterUserDto } from "@/types";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { postRegister } from "@/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Validaciones
const RegisterSchema = yup.object().shape({
  email: yup.string().email("Correo inválido").required("Campo requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("Campo requerido")
    .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
    .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .matches(/\d/, "Debe contener al menos un número")
    .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
      "Debe contener al menos un carácter especial"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
  name: yup.string().required("Campo requerido"),
});

const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  }

  const initialValues: RegisterUserDto & { confirmPassword: string } = {
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  };

  const handleOnSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {

      const { confirmPassword, ...userData } = values;
      await postRegister(userData);
      toast.success("Usuario registrado correctamente");
      router.push("/login");
    } catch {
      toast.error("Error al registrar el usuario");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Formik
        validationSchema={RegisterSchema}
        initialValues={initialValues}
        onSubmit={handleOnSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                id="name"
                type="text"
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                error={errors.name && touched.name ? errors.name : ""}
              />

              <Input
                label="Email"
                id="email"
                type="text"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                error={errors.email && touched.email ? errors.email : ""}
              />

              <Input
                className="mb-4"
                label="Contraseña"
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={
                  errors.password && touched.password ? errors.password : ""
                }
              >
                <div
                  onClick={togglePasswordVisibility}
                  className="cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </Input>

              <Input
                className="mb-4"
                label="Confirmar Contraseña"
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
                error={
                  errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ""
                }
              >
                <div
                  onClick={toggleConfirmPasswordVisibility}
                  className="cursor-pointer"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}

                </div>
              </Input>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              label="Registrarse"
              className="w-full"
            />
          </form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForm;
