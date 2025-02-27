'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const searchParams = useSearchParams();
  const issue = searchParams.get('issue');

  const getIssueContent = () => {
    switch (issue) {
      case 'payment':
        return {
          title: 'Payment Issue Detected',
          description: 'We noticed an issue with your payment processing. Don\'t worry, our team is here to help!',
          actions: [
            {
              label: 'Contact Support',
              href: 'mailto:support@cosmologic.academy',
            },
            {
              label: 'Try Again',
              href: '/pricing',
            }
          ]
        };
      default:
        return {
          title: 'Need Help?',
          description: 'Our support team is here to assist you with any questions or concerns.',
          actions: [
            {
              label: 'Contact Support',
              href: 'mailto:support@cosmologic.academy',
            }
          ]
        };
    }
  };

  const content = getIssueContent();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container max-w-md mx-auto px-4">
        <Card className="p-6">
          <div className="text-center mb-6">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
            <p className="text-gray-600 mb-6">{content.description}</p>
          </div>
          
          <div className="space-y-3">
            {content.actions.map((action, index) => (
              <Button
                key={index}
                asChild
                className="w-full"
                variant={index === 0 ? 'default' : 'outline'}
              >
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <Button variant="ghost" asChild className="w-full">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
