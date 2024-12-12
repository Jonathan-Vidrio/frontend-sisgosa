import { PageContent } from '@/core';
import { UserDetails } from '@/modules/users/ components/details/user-details';

/**
 * Renders the User Details page.
 *
 * This page displays detailed information about a specific user.
 *
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - A promise resolving to an object containing the user ID.
 * @returns {Promise<JSX.Element>} The user details page component.
 */
export default async function DetailsUserPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='User Details'>
      <UserDetails id={id} />
    </PageContent>
  );
}
