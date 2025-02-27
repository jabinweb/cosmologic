import { NextResponse } from "next/server";
import Razorpay from "razorpay";

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  // ... other properties
}

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      payment_capture: true, // Changed from 1 to true
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}
