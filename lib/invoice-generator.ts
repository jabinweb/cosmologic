import jsPDF from 'jspdf';
import { formatDate } from '@/lib/utils';

export function generateInvoicePDF({
  invoiceNumber,
  subscription,
  payment,
  user,
}: {
  invoiceNumber: string;
  subscription: any;
  payment: any;
  user: any;
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let y = 20;

  // Helper for text alignment
  const text = (text: string, x: number, currentY: number, align: 'left' | 'center' | 'right' = 'left') => {
    doc.text(text, x, currentY, { align });
    return doc.getTextDimensions(text).h + 2;
  };

  // Header
  doc.setFontSize(20);
  text('Cosmologic Academy', pageWidth / 2, y, 'center');
  
  doc.setFontSize(10);
  y += 10;
  text('123 Space Street', pageWidth / 2, y, 'center');
  y += 5;
  text('Bangalore, Karnataka 560001', pageWidth / 2, y, 'center');

  // Invoice Details
  y += 20;
  doc.setFontSize(16);
  text('INVOICE', pageWidth / 2, y, 'center');

  y += 15;
  doc.setFontSize(10);
  text(`Invoice Number: ${invoiceNumber}`, 20, y);
  y += 6;
  text(`Date: ${formatDate(new Date())}`, 20, y);
  y += 6;
  text(`Status: PAID`, 20, y);

  // Customer Details
  y += 15;
  doc.setFontSize(11);
  text('Bill To:', 20, y);
  y += 6;
  doc.setFontSize(10);
  text(user.name, 20, y);
  y += 6;
  text(user.email, 20, y);

  // Table Headers
  y += 15;
  const col1 = 20;
  const col2 = 80;
  const col3 = 120;
  const col4 = 170;

  doc.setFillColor(240, 240, 240);
  doc.rect(15, y - 5, pageWidth - 30, 10, 'F');
  doc.setFont(undefined, 'bold');
  text('Description', col1, y);
  text('Plan Type', col2, y);
  text('Amount', col4, y);

  // Table Content
  doc.setFont(undefined, 'normal');
  y += 15;
  text('Subscription Plan', col1, y);
  text(subscription.planId, col2, y);
  text(`₹${(payment.amount / 100).toFixed(2)}`, col4, y);

  // Totals
  const subtotal = payment.amount;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  y += 20;
  text('Subtotal:', col3, y);
  text(`₹${(subtotal / 100).toFixed(2)}`, col4, y);
  y += 6;
  text('GST (18%):', col3, y);
  text(`₹${(gst / 100).toFixed(2)}`, col4, y);
  y += 8;
  doc.setFont(undefined, 'bold');
  text('Total:', col3, y);
  text(`₹${(total / 100).toFixed(2)}`, col4, y);

  // Footer
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);
  const footer = 'Payment processed by Razorpay. This is a computer generated invoice.';
  text(footer, pageWidth / 2, doc.internal.pageSize.height - 10, 'center');

  return doc;
}
