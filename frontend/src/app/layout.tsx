import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UNclone Agent | Family Emergency AI Voice Scam Protection',
  description: 'Defensive AI agent app protecting families against voice-clone and fake-relative emergency scams using DetectifAI and LLM reasoning.',
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
