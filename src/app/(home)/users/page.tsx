import { PageContent } from '@/core';
import { UsersTable } from '@/modules/users/ components/tables/users-table';

/**
 * Renders the Users page.
 *
 * This page displays a table listing all users.
 *
 * @component
 * @returns {JSX.Element} The users page component.
 */
export default function UsersPage() {
  return (
    <PageContent title='Users'>
      <UsersTable />
    </PageContent>
  );
}
