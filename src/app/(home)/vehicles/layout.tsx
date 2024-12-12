import { AddButton } from '@/core';

/**
 * Renders the Vehicles Layout.
 *
 * Wraps the child components in a layout that includes an add button for creating new vehicles.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the layout.
 * @returns {JSX.Element} The vehicles layout component.
 */
export default function VehiclesLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      {children}

      <AddButton className='fixed bottom-10 right-10' />
    </section>
  );
}
