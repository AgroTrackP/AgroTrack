"use client"
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { RegisterUserDto } from "@/types";
import { Formik } from "formik";
import React from "react";
import * as yup from 'yup';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { postRegister } from "@/services/auth";


//Validaciones
const RegisterSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('Campo requerido'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), ""], 'Las contraseñas deben coincidir')
        .required('Campo requerido'),
    phone: yup.string()
        .required('Campo requerido'),
    address: yup.string()
        .required('Campo requerido'),
    name: yup.string()
        .required('Campo requerido')
});
interface RegisterUserForm extends RegisterUserDto {
    confirmPassword: string;
};

const RegisterForm = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const initialValues: RegisterUserForm = {
        email: '',
        password: '',
        confirmPassword: '',
        phone: "",
        address: "",
        name: ""

        //harcodeo
        // name: "Juan Pérez",
        // email: "juan.perez@example.com",
        // password: "Segura123!",
        // confirmPassword: "Segura123!",
        // phone: "+57 3104567890",
        // address: "Calle 123 #45-67, Bogotá, Colombia"
    }
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };


    const handleOnSubmit = async (values: RegisterUserForm, { setSubmitting }: any) => {
        const { confirmPassword, ...data } = values;
        try {
            const res = await postRegister(data);


            //     if(res.errors) {
            //         return alert(" Error al registrar el usuario");
            // }

            alert("Usuario registrado correctamente");

        } catch (e) {
            alert("Error al registrar el usuario");

        } finally {
            setSubmitting(false);

        }
    }

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
                    /* and other goodies */
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
                            <Input className="mb-4"
                                label="Contraseña"
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                error={errors.password && touched.password ? errors.password : ""}
                                children={<div onClick={handleShowPassword}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>

                                }
                            />

                            <Input className="mb-4"
                                label="Confirmar contraseña"
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirmPassword}
                                error={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ""}
                                children={<div onClick={handleShowPassword}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                                }
                            />
                            <Input
                                label="Telefono"
                                id="phone"
                                type="text"
                                name="phone"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.phone}
                                error={errors.phone && touched.phone ? errors.phone : ""}
                            />
                            <Input
                                label="Dirección"
                                id="address"
                                type="text"
                                name="address"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.address}
                                error={errors.address && touched.address ? errors.address : ""}
                            />
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
    )
}
export default RegisterForm




