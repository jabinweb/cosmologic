"use client";

import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <XCircle className="w-20 h-20 mx-auto text-red-500 mb-6" />
        </motion.div>
        <h1 className="text-4xl font-bold mb-4">Payment Failed</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Don't worry! No payment has been processed.
        </p>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Please try again or contact support if the problem persists.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.back()}>
              Retry Payment
            </Button>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Need help? Contact us at{" "}
              <a href="mailto:support@cosmologic.academy" className="text-purple-600">
                support@cosmologic.academy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
