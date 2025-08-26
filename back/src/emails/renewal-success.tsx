import {
  Body,
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

interface RenewalSuccessEmailProps {
  name: string;
  planName: string;
  planPrice: number;
  nextBillingDate: string;
}

export const RenewalSuccessEmail = ({
  name,
  planName,
  planPrice,
  nextBillingDate,
}: RenewalSuccessEmailProps) => (
  <Html>
    <Head />
    <Preview>Tu suscripción a AgroTrack ha sido renovada</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>¡Hola, {name}!</Heading>
        <Text style={text}>
          Te confirmamos que tu suscripción al plan <strong>{planName}</strong>{' '}
          ha sido renovada exitosamente.
        </Text>
        <Text style={text}>
          Hemos procesado el pago de <strong>${planPrice} USD</strong> y tu
          acceso a todas las funcionalidades premium continúa sin
          interrupciones.
        </Text>
        <Section style={detailsSection}>
          <Text style={detailsTitle}>Próxima Fecha de Facturación:</Text>
          <Text style={detailsValue}>{nextBillingDate}</Text>
        </Section>
        <Text style={text}>
          Gracias por seguir confiando en AgroTrack para potenciar tus cultivos.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>El equipo de AgroTrack</Text>
      </Container>
    </Body>
  </Html>
);

export default RenewalSuccessEmail;

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

const detailsSection = {
  backgroundColor: '#f8f9fa',
  padding: '1px 16px',
  margin: '20px 40px',
  borderRadius: '5px',
};

const detailsTitle = {
  color: '#6c757d',
  fontSize: '14px',
  margin: '10px 0 0',
  textAlign: 'center' as const,
};

const detailsValue = {
  color: '#212529',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '4px 0 10px',
  textAlign: 'center' as const,
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
