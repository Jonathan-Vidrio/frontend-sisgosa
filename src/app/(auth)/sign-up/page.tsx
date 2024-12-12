import { SignUpForm } from '@/modules/auth/components/forms/sign-up-form';
import Link from 'next/link';

/**
 * Renders the Sign Up page.
 * 
 * This page includes a sign-up form and a link to navigate to the sign-in page.
 * 
 * @component
 */
export default function SignUpPage() {
  return (
    <div>
      <h1 className='text-2xl font-bold'>Sign Up</h1>

      <SignUpForm />

      <div className='mt-5 text-center'>
        <span className='text-gray-500'>Already have an account? </span>
        <Link href='sign-in' passHref>
          <span className='hover:underline text-blue-500'>Sign In</span>
        </Link>
      </div>
    </div>
  );
}
