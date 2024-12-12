import { PasswordResetForm } from '@/modules/auth/components/forms/password-reset-form';
import Link from 'next/link';
import { Suspense } from 'react';

/**
 * Renders the Change Password page.
 *
 * This page allows users to reset their password. It retrieves the email parameter asynchronously
 * and includes a link to navigate back to the password recovery page.
 *
 * @async
 * @component
 */
export default async function ChangePasswodPage() {
  return (
    <div>
      <h1 className='text-2xl font-bold'>Change Password</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <PasswordResetForm />
      </Suspense>

      <div className='mt-5 text-center'>
        <span className='text-gray-500'>Having trouble? Back to </span>
        <Link className='text-blue-500 hover:underline' href={'/password-recovery'}>
          Password Recovery
        </Link>
      </div>
    </div>
  );
}
