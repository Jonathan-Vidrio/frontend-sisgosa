import { PageContent } from '@/core';
import { UpdateUserForm } from '@/modules/users/ components/forms/update-user-form';

/**
 * Renders the Update User page.
 *
 * This page provides a form to update an existing user.
 *
 * @async
 * @component
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - A promise resolving to an object containing the user ID.
 * @returns {Promise<JSX.Element>} The update user page component.
 */
export default async function UpdateUserPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <PageContent title='Update User' className='w-full flex flex-col justify-center items-center'>
      <UpdateUserForm className='w-1/2' id={id} />
    </PageContent>
  );
}
