import jsPDF from "jspdf";
import { allSalesData } from "../data/salesData";

export interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

export const generateInvoicePDF = (customerId: string, customerName: string, customerPhone: string = "", customerEmail: string = "") => {
  // پیدا کردن خریدهای مشتری از داده‌های فروش
  const customerPurchases = allSalesData.filter(sale => sale.customer === customerName);
  
  if (customerPurchases.length === 0) {
    alert("هیچ خریدی برای این مشتری یافت نشد");
    return;
  }

  // استفاده از آخرین خرید برای فاکتور
  const lastPurchase = customerPurchases[0];
  
  const invoiceData: InvoiceData = {
    invoiceNumber: lastPurchase.invoiceNumber,
    customerName: customerName,
    customerPhone: customerPhone,
    customerEmail: customerEmail,
    date: lastPurchase.date,
    items: [{
      name: lastPurchase.productName,
      quantity: lastPurchase.quantity,
      price: lastPurchase.amount / lastPurchase.quantity,
      total: lastPurchase.amount
    }],
    subtotal: lastPurchase.amount,
    tax: Math.round(lastPurchase.amount * 0.09), // 9% مالیات
    discount: 0,
    total: lastPurchase.amount + Math.round(lastPurchase.amount * 0.09)
  };

  generatePDF(invoiceData);
};

const generatePDF = (invoice: InvoiceData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Load custom Persian font (using default for now)
  doc.setFont("helvetica");
  
  // Set RTL direction
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Header - Company Logo/Name
  doc.setFillColor(41, 98, 255); // Primary color
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("Panel Binesh", pageWidth / 2, 15, { align: "center" });
  
  doc.setFontSize(12);
  doc.text("ERP System - Invoice", pageWidth / 2, 25, { align: "center" });
  doc.text("www.panelbinesh.com", pageWidth / 2, 32, { align: "center" });

  // Invoice Info Box
  let yPos = 55;
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, "FD");
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Invoice #${invoice.invoiceNumber}`, margin + 5, yPos + 8);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${invoice.date}`, margin + 5, yPos + 15);
  doc.text(`Customer: ${invoice.customerName}`, margin + 5, yPos + 22);
  if (invoice.customerPhone) {
    doc.text(`Phone: ${invoice.customerPhone}`, margin + 5, yPos + 29);
  }

  // Customer Info (Right side)
  if (invoice.customerEmail) {
    doc.text(`Email: ${invoice.customerEmail}`, pageWidth - margin - 5, yPos + 15, { align: "right" });
  }

  // Items Table
  yPos = 105;
  
  // Table Header
  doc.setFillColor(41, 98, 255);
  doc.rect(margin, yPos, contentWidth, 10, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  
  const col1 = margin + 5;
  const col2 = margin + 80;
  const col3 = margin + 105;
  const col4 = margin + 130;
  const col5 = margin + 155;
  
  doc.text("Item", col1, yPos + 7);
  doc.text("Qty", col2, yPos + 7);
  doc.text("Price", col3, yPos + 7);
  doc.text("Total", col5, yPos + 7);

  // Table Rows
  yPos += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  
  invoice.items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos, contentWidth, 8, "F");
    }
    
    doc.text(item.name, col1, yPos + 6);
    doc.text(String(item.quantity), col2, yPos + 6);
    doc.text(`${item.price.toLocaleString('en-US')} TMN`, col3, yPos + 6);
    doc.text(`${item.total.toLocaleString('en-US')} TMN`, col5, yPos + 6);
    
    yPos += 8;
  });

  // Summary Box
  yPos += 10;
  const summaryX = pageWidth - margin - 70;
  const summaryWidth = 65;
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  
  // Subtotal
  doc.line(summaryX, yPos, summaryX + summaryWidth, yPos);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", summaryX + 5, yPos + 6);
  doc.text(`${invoice.subtotal.toLocaleString('en-US')} TMN`, summaryX + summaryWidth - 5, yPos + 6, { align: "right" });
  yPos += 10;
  
  // Tax
  doc.line(summaryX, yPos, summaryX + summaryWidth, yPos);
  doc.text("Tax (9%):", summaryX + 5, yPos + 6);
  doc.text(`${invoice.tax.toLocaleString('en-US')} TMN`, summaryX + summaryWidth - 5, yPos + 6, { align: "right" });
  yPos += 10;
  
  // Discount
  if (invoice.discount > 0) {
    doc.line(summaryX, yPos, summaryX + summaryWidth, yPos);
    doc.text("Discount:", summaryX + 5, yPos + 6);
    doc.text(`-${invoice.discount.toLocaleString('en-US')} TMN`, summaryX + summaryWidth - 5, yPos + 6, { align: "right" });
    yPos += 10;
  }
  
  // Total
  doc.setFillColor(41, 98, 255);
  doc.rect(summaryX, yPos, summaryWidth, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Total:", summaryX + 5, yPos + 7);
  doc.text(`${invoice.total.toLocaleString('en-US')} TMN`, summaryX + summaryWidth - 5, yPos + 7, { align: "right" });

  // Footer
  yPos = pageHeight - 30;
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  doc.text("Thank you for your business!", pageWidth / 2, yPos, { align: "center" });
  doc.text("Payment Status: " + (invoice.total > 0 ? "Paid" : "Pending"), pageWidth / 2, yPos + 5, { align: "center" });
  
  doc.setFontSize(8);
  doc.text("Panel Binesh ERP System | Support: support@panelbinesh.com | Tel: +98 21 1234 5678", pageWidth / 2, yPos + 12, { align: "center" });
  
  // Watermark
  doc.setTextColor(240, 240, 240);
  doc.setFontSize(60);
  doc.text("INVOICE", pageWidth / 2, pageHeight / 2, { 
    align: "center",
    angle: 45
  });

  // Save PDF
  doc.save(`Invoice_${invoice.invoiceNumber}_${invoice.customerName.replace(/\s+/g, '_')}.pdf`);
};
