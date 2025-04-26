import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ReceiptEmailProps {
  paymentAmount: string;
  paymentCurrency: string;
  currencySymbol: string;
  recipientPhone: string;
  recipientEmail: string;
  paymentReference: string;
  paymentMotif?: string;
  paymentDate: string;
  satsAmount: number;
}

export const ReceiptEmail = ({
  paymentAmount,
  paymentCurrency,
  currencySymbol,
  recipientPhone,
  recipientEmail,
  paymentReference,
  paymentMotif,
  paymentDate,
  satsAmount,
}: ReceiptEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reçu de paiement Valest</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reçu de paiement</Heading>

          <Section style={section}>
            <Text style={text}>
              Votre paiement de {currencySymbol}{paymentAmount} {paymentCurrency} a été effectué avec succès.
            </Text>

            <Text style={text}>Détails de la transaction:</Text>

            <Section style={detailSection}>
              <Text style={detail}>
                <strong>Montant:</strong> {currencySymbol}{paymentAmount} {paymentCurrency}
              </Text>
              <Text style={detail}>
                <strong>Équivalent BTC:</strong> {satsAmount.toLocaleString()} SATS
              </Text>
              <Text style={detail}>
                <strong>Référence:</strong> {paymentReference}
              </Text>
              <Text style={detail}>
                <strong>Date:</strong> {paymentDate}
              </Text>
              <Text style={detail}>
                <strong>Téléphone:</strong> {recipientPhone}
              </Text>
              {paymentMotif && (
                <Text style={detail}>
                  <strong>Motif:</strong> {paymentMotif}
                </Text>
              )}
            </Section>

            <Text style={text}>
              Un reçu détaillé a été envoyé à {recipientEmail}
            </Text>
          </Section>

          <Text style={footer}>
            © {new Date().getFullYear()} Valest. Tous droits réservés.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const section = {
  padding: "24px",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "16px",
};

const detailSection = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "24px",
};

const detail = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "20px",
  marginBottom: "8px",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};

export default ReceiptEmail;