import * as React from "react";
import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export type OrderItem = {
  id?: string;
  name: string;
  quantity: number;
  price: number; // per unit
};

export type Address = {
  name?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type OrderConfirmationEmailProps = {
  customerName: string;
  orderId: string;
  orderDate: string; // ISO or formatted
  items: OrderItem[];
  currency?: string; // default: INR
  subtotal: number;
  shipping: number;
  discount?: number;
  tax?: number;
  total: number;
  shippingAddress?: Address;
  billingAddress?: Address;
  supportEmail?: string;
  contactPhone?: string;
  siteUrl?: string;
  logoUrl?: string;
  brandName?: string; // default: Kislay Naturals
};

export default function OrderConfirmationEmail({
  customerName,
  orderId,
  orderDate,
  items,
  currency = "INR",
  subtotal,
  shipping,
  discount = 0,
  tax = 0,
  total,
  shippingAddress,
  billingAddress,
  supportEmail = "support@kislaynaturals.com",
  contactPhone,
  siteUrl = "https://kislaynaturals.com",
  logoUrl = "https://kislaynaturals.com/logo.png",
  brandName = "Kislay Naturals",
}: OrderConfirmationEmailProps) {
  const previewText = `Your ${brandName} order ${orderId} is confirmed`;

  const currencyFmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            {logoUrl ? (
              <Img src={logoUrl} alt={brandName} width={160} height={48} style={styles.logo} />
            ) : (
              <Text style={styles.brandText}>{brandName}</Text>
            )}
          </Section>

          <Section>
            <Text style={styles.h1}>Order confirmed 🎉</Text>
            <Text style={styles.paragraph}>
              Hi {customerName},
              <br />
              Thanks for shopping with {brandName}. Your order is confirmed and we’re
              getting it ready. We’ll notify you when it is delivered.
            </Text>

            <Row style={styles.kvRow}>
              <Column>
                <Text style={styles.kvKey}>Order ID</Text>
                <Text style={styles.kvValue}>{orderId}</Text>
              </Column>
              <Column>
                <Text style={styles.kvKey}>Order date</Text>
                <Text style={styles.kvValue}>{orderDate}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={styles.card}>
            <Text style={styles.h2}>Order summary</Text>
            {items.map((item) => (
              <Row key={`${item.id ?? item.name}`} style={styles.itemRow}>
                <Column style={{ width: "60%" }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={{ width: "40%", textAlign: "right" as const }}>
                  <Text style={styles.itemPrice}>
                    {currencyFmt.format(item.price * item.quantity)}
                  </Text>
                </Column>
              </Row>
            ))}
            <Hr style={styles.hr} />
            <Row style={styles.totalRow}>
              <Column>
                <Text style={styles.totalLabel}>Subtotal</Text>
              </Column>
              <Column style={styles.totalValueCol}>
                <Text style={styles.totalValue}>{currencyFmt.format(subtotal)}</Text>
              </Column>
            </Row>
            {discount > 0 && (
              <Row style={styles.totalRow}>
                <Column>
                  <Text style={styles.totalLabel}>Discount</Text>
                </Column>
                <Column style={styles.totalValueCol}>
                  <Text style={styles.totalValue}>- {currencyFmt.format(discount)}</Text>
                </Column>
              </Row>
            )}
            {tax > 0 && (
              <Row style={styles.totalRow}>
                <Column>
                  <Text style={styles.totalLabel}>Tax</Text>
                </Column>
                <Column style={styles.totalValueCol}>
                  <Text style={styles.totalValue}>{currencyFmt.format(tax)}</Text>
                </Column>
              </Row>
            )}
            <Row style={styles.totalRow}>
              <Column>
                <Text style={styles.totalLabel}>Shipping</Text>
              </Column>
              <Column style={styles.totalValueCol}>
                <Text style={styles.totalValue}>{currencyFmt.format(shipping)}</Text>
              </Column>
            </Row>
            <Hr style={styles.hr} />
            <Row style={styles.grandRow}>
              <Column>
                <Text style={styles.grandLabel}>Total</Text>
              </Column>
              <Column style={styles.totalValueCol}>
                <Text style={styles.grandValue}>{currencyFmt.format(total)}</Text>
              </Column>
            </Row>
          </Section>

          {(shippingAddress || billingAddress) && (
            <Section style={styles.addresses}>
              <Row>
                {shippingAddress && (
                  <Column style={styles.addrCol}>
                    <Text style={styles.h3}>Shipping address</Text>
                    <AddressBlock address={shippingAddress} />
                  </Column>
                )}
                {billingAddress && (
                  <Column style={styles.addrCol}>
                    <Text style={styles.h3}>Billing address</Text>
                    <AddressBlock address={billingAddress} />
                  </Column>
                )}
              </Row>
            </Section>
          )}

          <Section style={styles.help}>
            <Text style={styles.paragraph}>
              Need help? Reply to this email or contact us at {" "}
              <Link href={`mailto:${supportEmail}`} style={styles.link}>
                {supportEmail}
              </Link>
              {contactPhone ? (
                <>
                  {" "}or call {" "}
                  <Link href={`tel:${contactPhone}`} style={styles.link}>
                    {contactPhone}
                  </Link>
                </>
              ) : null}
              .
            </Text>
            <Text style={styles.paragraph}>
              You can view your order status any time at {" "}
              <Link href={siteUrl} style={styles.link}>
                {siteUrl.replace(/^https?:\/\//, "")}
              </Link>
              .
            </Text>
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} {brandName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function AddressBlock({ address }: { address: Address }) {
  return (
    <Text style={styles.addressText}>
      {address.name ? (
        <>
          {address.name}
          <br />
        </>
      ) : null}
      {address.line1}
      <br />
      {address.line2 ? (
        <>
          {address.line2}
          <br />
        </>
      ) : null}
      {[address.city, address.state].filter(Boolean).join(", ")}{" "}
      {address.postalCode}
      <br />
      {address.country}
      {address.phone ? (
        <>
          <br />
          {address.phone}
        </>
      ) : null}
    </Text>
  );
}

// Simple inline styles for email clients
const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: "#f6f9fc",
    margin: 0,
    padding: "24px 0",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
    color: "#111827",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    margin: "0 auto",
    width: "100%",
    maxWidth: 640,
    padding: 24,
    boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: 8,
  },
  logo: {
    display: "inline-block",
    margin: "0 auto",
  },
  brandText: {
    fontSize: 18,
    fontWeight: 600,
  },
  h1: {
    fontSize: 22,
    fontWeight: 700,
    margin: "8px 0 4px",
  },
  h2: {
    fontSize: 18,
    fontWeight: 700,
    margin: "0 0 12px",
  },
  h3: {
    fontSize: 14,
    fontWeight: 600,
    margin: "0 0 8px",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 1.6,
    margin: "0 0 12px",
    color: "#374151",
  },
  kvRow: {
    marginTop: 8,
    marginBottom: 16,
  },
  kvKey: {
    fontSize: 12,
    color: "#6b7280",
    margin: 0,
  },
  kvValue: {
    fontSize: 14,
    fontWeight: 600,
    margin: 0,
  },
  card: {
    backgroundColor: "#fafafa",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  itemRow: {
    padding: "6px 0",
  },
  itemName: {
    fontSize: 14,
    margin: 0,
  },
  itemMeta: {
    fontSize: 12,
    color: "#6b7280",
    margin: 0,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 600,
    margin: 0,
  },
  hr: {
    borderColor: "#e5e7eb",
    margin: "8px 0",
  },
  totalRow: {
    padding: "2px 0",
  },
  totalLabel: {
    fontSize: 13,
    color: "#374151",
    margin: 0,
  },
  totalValueCol: {
    textAlign: "right",
  },
  totalValue: {
    fontSize: 13,
    fontWeight: 600,
    margin: 0,
  },
  grandRow: {
    paddingTop: 6,
  },
  grandLabel: {
    fontSize: 14,
    fontWeight: 700,
    margin: 0,
  },
  grandValue: {
    fontSize: 16,
    fontWeight: 800,
    margin: 0,
  },
  addresses: {
    marginTop: 16,
  },
  addrCol: {
    paddingRight: 8,
  },
  addressText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 1.6,
  },
  help: {
    marginTop: 12,
  },
  link: {
    color: "#2563eb",
    textDecoration: "underline",
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    marginTop: 16,
    paddingTop: 12,
    textAlign: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#6b7280",
  },
};
