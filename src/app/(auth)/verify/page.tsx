import { VerifyForm } from '@/modules/auth/components/forms/verify-form';
import Link from 'next/link';
import { Suspense } from 'react';

/**
 * Renders the Verify Email page.
 *
 * This page includes a form for verifying the user's email address and a link to navigate back to the sign-up page.
 *
 * @async
 * @component
 */
export default async function VerifyPage() {
  return (
    <div>
      <h1 className='text-2xl font-bold'>Insert your email</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <VerifyForm />
      </Suspense>

      <div className='mt-5 text-center'>
        <span className='text-gray-500'>Did not receive the OTP or having trouble? Back to </span>
        <Link className='text-blue-500 hover:underline' href={'/sign-up'}>
          Sign Up
        </Link>
      </div>
    </div>
  );
}
