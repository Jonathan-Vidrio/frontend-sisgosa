import { PageContent } from '@/core';
import { CreateUserForm } from '@/modules/users/ components/forms/create-user-form';

/**
 * Renders the Create User page.
 *
 * This page includes a form for creating a new user.
 *
 * @component
 * @returns {JSX.Element} The create user page component.
 */
export default function CreateUserPage() {
  return (
    <PageContent title='New User' className='w-full flex flex-col justify-center items-center'>
      <CreateUserForm className='w-1/2' />
    </PageContent>
  );
}
