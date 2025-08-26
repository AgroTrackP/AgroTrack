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

interface SubscriptionCanceledEmailProps {
  name: string;
}

export const SubscriptionCanceledEmail = ({
  name,
}: SubscriptionCanceledEmailProps) => {
  const feedbackUrl = `https://TU_FRONTEND_URL/feedback`;

  return (
    <Html>
      <Head />
      <Preview>Confirmación de cancelación de tu cuenta de AgroTrack</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Lamentamos verte partir, {name}</Heading>
          <Text style={text}>
            Te confirmamos que tu suscripción a AgroTrack ha sido cancelada
            exitosamente.
          </Text>
          <Text style={text}>
            No te preocupes, aún tendrás acceso a todas las funcionalidades de
            tu plan hasta el final de tu ciclo de facturación actual.
          </Text>
          <Text style={text}>
            Nos encantaría saber por qué te vas para poder mejorar. Si tienes un
            momento, te agradeceríamos que compartieras tu opinión.
          </Text>
          <Button style={button} href={feedbackUrl}>
            Compartir Opinión
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            Gracias por haber sido parte de la comunidad de AgroTrack.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default SubscriptionCanceledEmail;

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
