import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Playground - Cosmologic',
  description: 'Interactive coding playground',
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
