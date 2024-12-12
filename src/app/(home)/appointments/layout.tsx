import { AddButton } from '@/core';

/**
 * Renders the Appointments Layout.
 *
 * Wraps the child components in a layout that includes an add button for creating new appointments.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the layout.
 */
export default function AppoitmentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      {children}

      <AddButton className='fixed bottom-10 right-10' />
    </section>
  );
}
