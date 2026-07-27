"use client"

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const searchParams = useSearchParams();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/logo/logonew.png"
              alt="Kislay Naturals"
              width={300}
              height={108}
              className="h-24 w-auto"
            />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        {searchParams?.get('registered') === 'true' && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm animate-in slide-in-from-top-2 duration-500">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-green-800 animate-in fade-in duration-700 delay-200">
                  Account created successfully!
                </p>
                <p className="mt-1 text-sm text-green-700 animate-in fade-in duration-700 delay-300">
                  Please sign in with your email and password to continue.
                </p>
              </div>
            </div>
          </div>
        )}
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
