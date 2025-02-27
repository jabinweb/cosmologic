'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    let retries = 0;
    const maxRetries = 15; // Increase max retries
    const retryInterval = 2000;
    let timeoutId: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        console.log(`Checking status (attempt ${retries + 1})`);
        const res = await fetch(`/api/subscription/status?orderId=${orderId}`);
        const data = await res.json();
        
        console.log('Status response:', data);
        
        if (data.status === 'ACTIVE' || data.paymentStatus === 'SUCCESS') {
          console.log('Payment confirmed as successful');
          setLoading(false);
          return;
        }

        retries++;
        if (retries >= maxRetries) {
          console.log('Max retries reached, redirecting to support');
          router.push('/support?issue=payment');
          return;
        }

        console.log(`Retrying in ${retryInterval}ms...`);
        timeoutId = setTimeout(checkStatus, retryInterval);
      } catch (error) {
        console.error('Status check failed:', error);
        router.push('/support?issue=payment');
      }
    };

    if (orderId) {
      checkStatus();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container max-w-md mx-auto px-4 text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" />
          <h2 className="text-xl">Confirming your subscription...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container max-w-md mx-auto px-4">
        <Card className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for subscribing. Your access has been activated.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    </div>
  );
}
