// dish-drop-client/src/app/payment/success/page.jsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the component with SSR disabled
const PaymentSuccessContent = dynamic(
  () => import('@/components/payment/PaymentSuccessContent'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D85A30] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }
);

export default function PaymentSuccessPage() {
  return <PaymentSuccessContent />;
}