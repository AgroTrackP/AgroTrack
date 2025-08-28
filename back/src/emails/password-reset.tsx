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

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export const PasswordResetEmail = ({
  name,
  resetUrl,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Restablece tu contraseña de AgroTrack</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Hola, {name}</Heading>
        <Text style={text}>
          Hemos recibido una solicitud para restablecer la contraseña de tu
          cuenta en AgroTrack.
        </Text>
        <Text style={text}>
          Haz clic en el botón de abajo para establecer una nueva contraseña.
          Este enlace es válido por 15 minutos.
        </Text>
        <Button style={button} href={resetUrl}>
          Restablecer Contraseña
        </Button>
        <Text style={text}>
          Si no solicitaste este cambio, puedes ignorar este correo de forma
          segura.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>El equipo de AgroTrack</Text>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

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
  margin: '20px 20px',
};

const button = {
  backgroundColor: '#22c55e',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '250px',
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
