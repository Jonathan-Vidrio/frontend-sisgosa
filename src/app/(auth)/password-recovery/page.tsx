import { PasswordRecoveryForm } from '@/modules/auth/components/forms/password-recovery-form';
import Link from 'next/link';

/**
 * Renders the Password Recovery page.
 *
 * This page includes a form for password recovery and a link to navigate back to the sign-in page.
 *
 * @component
 */
export default function PasswordRecoveryPage() {
  return (
    <div>
      <h1 className='text-2xl font-bold'>Password Recovery</h1>

      <PasswordRecoveryForm />

      <div className='mt-5 text-center'>
        <span className='text-gray-500'>Remember your password? Back to </span>
        <Link className='text-blue-500 hover:underline' href={'/sign-in'}>
          Sign In
        </Link>
      </div>
    </div>
  );
}
