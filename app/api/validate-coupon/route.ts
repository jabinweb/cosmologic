import { NextResponse } from "next/server";

// In a real app, this would be in a database
const VALID_COUPONS = {
  "WELCOME": { discount: 10 },
  "EARLYBIRD": { discount: 15 },
  "SPECIAL": { discount: 20 },
};

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    const upperCode = code.toUpperCase();
    
    if (VALID_COUPONS[upperCode as keyof typeof VALID_COUPONS]) {
      return NextResponse.json({
        valid: true,
        discount: VALID_COUPONS[upperCode as keyof typeof VALID_COUPONS].discount,
      });
    }

    return NextResponse.json({ valid: false });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
