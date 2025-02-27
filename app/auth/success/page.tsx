"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  useEffect(() => {
    // Clear the cart/selected course after successful payment
    localStorage.removeItem('selectedCourse');
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
        </motion.div>
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Thank you for enrolling. Your journey begins now!
        </p>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Check your email for login credentials and next steps.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
