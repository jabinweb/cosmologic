'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from './session-provider';

interface SubscriptionContextType {
  isSubscribed: boolean;
  isLoading: boolean;
  subscription: any | null;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isSubscribed: false,
  isLoading: true,
  subscription: null,
  refreshSubscription: async () => {},
});

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, status } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  const refreshSubscription = async () => {
    if (status !== 'authenticated') {
      setIsSubscribed(false);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/subscription/current');
      const data = await res.json();
      setSubscription(data.subscription);
      setIsSubscribed(!!data.subscription);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      setIsSubscribed(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, [status]);

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        isLoading,
        subscription,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};
