/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Heading,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

// 1. La interfaz define las 'props' que recibirá tu plantilla
interface ConfirmationEmailProps {
  name: string;
  email: string;
}

// 2. Este es tu nuevo componente de correo
export const ConfirmationEmail = ({ name, email }: ConfirmationEmailProps) => {
  const confirmationUrl = `https://agrotrack-develop.onrender.com/auth/confirmation/${email}`;

  return (
    <Html>
      <Head />
      <Preview>Bienvenido a AgroTrack - Confirma tu cuenta</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Hola, {name}!</Heading>
          <Text style={text}>Gracias por registrarte en AgroTrack.</Text>
          <Text style={text}>
            Por favor, confirma tu cuenta haciendo clic en el botón de abajo:
          </Text>
          <Button style={button} href={confirmationUrl}>
            Confirmar Cuenta
          </Button>
          <Text style={text}>Si no te registraste, ignora este mensaje.</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Saludos,
            <br />
            El equipo de AgroTrack
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ConfirmationEmail;

// --- 3. Estilos en línea para máxima compatibilidad ---
// Estos estilos se aplicarán directamente a cada etiqueta HTML.

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  borderRadius: '5px',
};

const h1 = {
  color: '#1d1c1d',
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#3c4043',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'center' as const,
  margin: '0 20px',
};

const button = {
  backgroundColor: '#22c55e', // Verde de Tailwind
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '12px',
  margin: '24px auto',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};
