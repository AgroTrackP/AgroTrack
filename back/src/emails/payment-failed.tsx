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
  Section,
} from '@react-email/components';
import * as React from 'react';

interface PaymentFailedEmailProps {
  name: string;
  billingUrl: string;
}

export const PaymentFailedEmail = ({
  name,
  billingUrl,
}: PaymentFailedEmailProps) => (
  <Html>
    <Head />
    <Preview>Acción requerida: Problema con tu pago de AgroTrack</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={h1}>⚠️ Problema con tu Pago</Heading>
        </Section>
        <Text style={text}>¡Hola, {name}!</Text>
        <Text style={text}>
          Te informamos que no pudimos procesar el pago de renovación de tu
          suscripción a AgroTrack. Esto puede deberse a una tarjeta vencida o
          fondos insuficientes.
        </Text>
        <Text style={text}>
          Tu cuenta ha entrado en un período de espera para que puedas seguir
          accediendo a tus beneficios mientras solucionas el problema.
        </Text>
        <Text style={text}>
          <strong>
            Por favor, actualiza tu método de pago para mantener tu suscripción
            activa:
          </strong>
        </Text>
        <Button style={button} href={billingUrl}>
          Actualizar Información de Pago
        </Button>
        <Text style={text}>
          Una vez actualizado, intentaremos realizar el cobro nuevamente en los
          próximos días. Si tienes alguna pregunta, no dudes en contactar a
          nuestro soporte.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>El equipo de AgroTrack</Text>
      </Container>
    </Body>
  </Html>
);

export default PaymentFailedEmail;

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

const headerSection = {
  backgroundColor: '#fffbe6',
  border: '1px solid #fde047',
  padding: '10px',
  borderRadius: '5px 5px 0 0',
};

const h1 = {
  color: '#b45309',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '10px 0',
};

const text = {
  color: '#3c4043',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'center' as const,
  margin: '20px 20px',
};

const button = {
  backgroundColor: '#f97316',
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
