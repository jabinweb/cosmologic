import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Playground - Cosmologic',
  description: 'Interactive coding playground',
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Script
        src="https://unpkg.com/typescript@latest/lib/typescriptServices.js"
        strategy="beforeInteractive"
      />
      {children}
    </div>
  );
}
