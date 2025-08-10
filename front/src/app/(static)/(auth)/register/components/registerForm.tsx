"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { RegisterUserDto } from "@/types";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { postRegister } from "@/services/auth";

// Validaciones
const RegisterSchema = yup.object().shape({
  email: yup.string().email("Correo inválido").required("Campo requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("Campo requerido"),
  name: yup.string().required("Campo requerido"),
});

const RegisterForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const initialValues: RegisterUserDto = {
    email: "",
    password: "",
    name: "",
  };

  const handleOnSubmit = async (
    values: RegisterUserDto,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await postRegister(values);
      alert("Usuario registrado correctamente");
    } catch {
      alert("Error al registrar el usuario");
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







