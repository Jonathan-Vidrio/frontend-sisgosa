import { SignInForm } from '@/modules/auth/components/forms/sign-in-form';
import Link from 'next/link';

/**
 * Renders the Sign In page.
 *
 * This page includes a sign-in form and links for password recovery and account registration.
 *
 * @component
 */
export default function SignInPage() {
  return (
    <div>
      <h1 className='text-2xl font-bold'>Sign In</h1>

      <SignInForm />

      <div className='mt-5 text-center'>
        <span className='text-gray-500'>Forgot your password? </span>
        <Link href='password-recovery' passHref>
          <span className='hover:underline text-blue-500'>Reset it</span>
        </Link>
      </div>

      <div className='mt-5 text-center'>
        <span className='text-gray-500'>Do not have an account? </span>
        <Link href='sign-up' passHref>
          <span className='hover:underline text-blue-500'>Sign Up</span>
        </Link>
      </div>
    </div>
  );
}
