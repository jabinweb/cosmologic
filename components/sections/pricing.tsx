"use client";

import { useState } from "react";
import { Book } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const courses = {
  Beginners: {
    Offline: 2999,
    Online: 2499,
    features: ["Basic programming concepts", "HTML, CSS fundamentals", "JavaScript basics"]
  },
  Intermediate: {
    Offline: 3999,
    Online: 3499,
    features: ["Advanced JavaScript", "React fundamentals", "Backend basics"]
  },
  Advanced: {
    Offline: 4999,
    Online: 4499,
    features: ["Full-stack development", "System design", "DevOps basics"]
  }
};

export function PricingSection() {
  const [mode, setMode] = useState("Online");

  const handlePayment = async (course: string, price: number) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: price * 100,
      currency: "INR",
      name: "Cosmologic Academy",
      description: `${course} Course - ${mode} Mode`,
      handler: function(response: any) {
        console.log(response);
      },
      prefill: {
        email: "",
        contact: ""
      }
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Courses & Pricing</h2>
        
        <div className="max-w-md mx-auto mb-12">
          <RadioGroup
            defaultValue="Online"
            onValueChange={setMode}
            className="flex justify-center gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Online" id="online" />
              <Label htmlFor="online">Online</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Offline" id="offline" />
              <Label htmlFor="offline">Offline</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(courses).map(([level, details], index) => (
            <Card key={index} className="p-6">
              <h3 className="text-2xl font-bold mb-4">{level}</h3>
              <div className="mb-6">
                <p className="text-3xl font-bold text-purple-600">
                  ₹{details[mode as keyof typeof details].toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{mode} Mode</p>
              </div>
              <ul className="mb-6 space-y-2">
                {details.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Book className="w-4 h-4 text-purple-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={() => handlePayment(level, details[mode as keyof typeof details])}
              >
                Enroll Now
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-purple-600 font-semibold">
            First 10 Students Get 20% Off!
          </p>
          <p className="mt-2">
            Contact us: <a href="tel:+919170523331" className="text-purple-600">+91 9170523331</a>
          </p>
        </div>
      </div>
    </section>
  );
}