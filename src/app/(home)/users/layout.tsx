import { AddButton } from '@/core';

/**
 * Renders the Users Layout.
 *
 * Wraps the child components in a layout that includes an add button for creating new users or worker types.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the layout.
 * @returns {JSX.Element} The users layout component.
 */
export default function UsersLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <section>
      {children}

      <AddButton className='fixed bottom-10 right-10' />
    </section>
  );
}
