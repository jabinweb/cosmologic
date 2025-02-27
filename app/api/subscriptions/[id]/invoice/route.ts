import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateInvoicePDF } from '@/lib/invoice-generator';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        payments: {
          where: { status: 'SUCCESS' },
          take: 1,
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!subscription || !subscription.payments.length) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const payment = subscription.payments[0];
    const invoiceNumber = `INV-${subscription.id.slice(-6)}-${new Date().getFullYear()}`;

    // Generate PDF
    const doc = generateInvoicePDF({
      invoiceNumber,
      subscription,
      payment,
      user: subscription.user,
    });

    // Convert to buffer
    const buffer = doc.output('arraybuffer');

    // Return PDF
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set(
      'Content-Disposition',
      `attachment; filename="invoice-${invoiceNumber}.pdf"`
    );

    return new NextResponse(buffer, { headers });

  } catch (error) {
    console.error('Failed to generate invoice:', error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
