import type { Metadata } from 'next';

/**
 * Metadata for the authentication-related pages.
 *
 * Provides the title and description for the authentication pages in the application.
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: 'SisGOSA - Sign In',
  description: 'Automotive Service Operations Management System - Diversity Global Inc.',
};

/**
 * Renders the authentication layout.
 *
 * Wraps the children components in a styled layout suitable for authentication-related pages.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the layout.
 */
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='min-h-screen bg-gray-200 flex justify-center items-center'>
      <section className='w-full sm:w-[80%] h-[100vh] sm:h-[700px] flex items-center bg-blue-500'>
        <div className='w-full lg:w-3/4 xl:w-1/2 h-full bg-white p-20 flex flex-col justify-center'>{children}</div>
        <div />
      </section>
    </main>
  );
}
