import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FamilyShield AI | Family Voice-Clone & Emergency Scam Defense',
  description: 'Defensive AI platform protecting families and seniors against voice-clone calls and emergency extortion using DetectifAI and honest LLM reasoning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
