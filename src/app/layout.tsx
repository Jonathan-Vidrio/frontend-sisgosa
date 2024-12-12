import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ModalTemplate } from '@/core';

/**
 * @constant
 * @description Inter font configuration for the application
 */
const inter = Inter({ subsets: ['latin'] });

/**
 * @constant
 * @type {Metadata}
 * @description Application metadata including title and description
 */
export const metadata: Metadata = {
  title: 'SisGOSA',
  description: 'Sistema para la Gestión de Operaciones de Servicios Automotrices - Diversity Global Inc.',
};

/**
 * @function RootLayout
 * @description Root layout component that wraps all pages
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} Root layout structure
 *
 * @example
 * <RootLayout>
 *   <HomePage />
 * </RootLayout>
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang='es'>
      <body className={`${inter.className}`}>
        <ModalTemplate />
        {children}
      </body>
    </html>
  );
}
