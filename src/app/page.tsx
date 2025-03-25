
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccessCode } from '@/context/AccessContext';

export default function RootPage() {
  const router = useRouter();
  const { isVerified } = useAccessCode();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_IS_ACCESS_KEY === 'true' && !isVerified) {
      router.push('/access');
    } else {
      router.push('/home');
    }
  }, [isVerified, router]);

  return null;
}
