import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface AccessTokenEmailProps {
  email: string;
  link: string;
}

export const AccessTokenEmail = ({ link }: AccessTokenEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Acesse sua conta e redefina sua senha.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={text}>
              Recebemos uma solicitação para acessar sua conta. Clique no botão abaixo para prosseguir e redefinir sua senha.
            </Text>

            <Button style={button} href={link}>
              Acessar Conta
            </Button>
          </Section>

          <Text style={footer}>Vai pela Sombra</Text>
        </Container>
      </Body>
    </Html>
  );
};

// PreviewProps continuam úteis para o desenvolvimento visual do e-mail.
AccessTokenEmail.PreviewProps = {
  email: 'example@example.com',
  link: 'http://localhost:3000/mock-link',
} as AccessTokenEmailProps;

export default AccessTokenEmail;

// Os estilos continuam os mesmos, estão ótimos.
const main = {
  backgroundColor: '#ffffff',
  color: '#24292e',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '20px 0 48px',
};

const section = {
  padding: '24px',
  border: 'solid 1px #dedede',
  borderRadius: '5px',
  textAlign: 'center' as const,
};

const text = {
  margin: '0 0 20px 0', // Aumentei a margem para dar mais espaço
  textAlign: 'left' as const,
};

const button = {
  fontSize: '14px',
  backgroundColor: '#28a745',
  color: '#fff',
  lineHeight: 1.5,
  borderRadius: '0.5em',
  padding: '12px 24px',
  textDecoration: 'none',
};

const footer = {
  color: '#6a737d',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '60px',
};