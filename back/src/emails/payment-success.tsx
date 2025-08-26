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
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface PaymentSuccessEmailProps {
  name: string;
  planName: string;
  planPrice: number;
  planFeatures: string[];
}

export const PaymentSuccessEmail = ({
  name,
  planName,
  planPrice,
  planFeatures,
}: PaymentSuccessEmailProps) => (
  <Html>
    <Head />
    <Preview>¡Tu suscripción a AgroTrack está activa!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>¡Gracias por suscribirte, {name}!</Heading>
        <Text style={text}>
          Tu pago ha sido procesado exitosamente y tu suscripción a AgroTrack ya
          está activa.
        </Text>

        {/* Sección de detalles del plan */}
        <Section style={planDetailsSection}>
          <Row>
            <Column>
              <Text style={detailsTitle}>Plan Activado:</Text>
              <Text style={detailsValue}>{planName}</Text>
            </Column>
            <Column style={{ textAlign: 'right' }}>
              <Text style={detailsTitle}>Precio:</Text>
              <Text style={detailsValue}>${planPrice} USD/mes</Text>
            </Column>
          </Row>
        </Section>

        <Text style={text}>
          Ahora tienes acceso a las siguientes características:
        </Text>

        {/* Lista de características */}
        <Section style={{ padding: '0 20px' }}>
          <ul>
            {planFeatures.map((feature) => (
              <li key={feature} style={featureItem}>
                ✅ {feature}
              </li>
            ))}
          </ul>
        </Section>

        <Text style={text}>
          ¡Gracias por confiar en nosotros para optimizar tus cultivos!
        </Text>
        <Hr style={hr} />
        <Text style={footer}>El equipo de AgroTrack</Text>
      </Container>
    </Body>
  </Html>
);

export default PaymentSuccessEmail;

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

const planDetailsSection = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #dee2e6',
  padding: '16px',
  margin: '20px 40px',
  borderRadius: '5px',
};

const detailsTitle = {
  color: '#6c757d',
  fontSize: '14px',
  margin: '0',
};

const detailsValue = {
  color: '#212529',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '4px 0 0',
};

const featureItem = {
  color: '#3c4043',
  fontSize: '16px',
  lineHeight: '28px',
  textAlign: 'left' as const,
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
