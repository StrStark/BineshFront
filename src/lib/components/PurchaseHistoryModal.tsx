"use client"

import { X, ShoppingCart, Calendar, Package, DollarSign, Download, FileText } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

interface PurchaseHistoryItem {
  id: number;
  date: string;
  invoiceNumber: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentStatus: "پرداخت شده" | "در انتظار" | "لغو شده";
  orderStatus: "تحویل شده" | "در حال ارسال" | "آماده ارسال" | "لغو شده";
}

interface PurchaseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  phoneNumber?: string;
  purchaseHistory: PurchaseHistoryItem[];
}

export function PurchaseHistoryModal({
  isOpen,
  onClose,
  customerName,
  phoneNumber = "0912-XXX-XXXX",
  purchaseHistory,
}: PurchaseHistoryModalProps) {
  if (!isOpen) return null;

  const colors = useCurrentColors();

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "پرداخت شده":
        return { text: colors.success, bg: colors.success + "15" };
      case "در انتظار":
        return { text: colors.warning, bg: colors.warning + "15" };
      case "لغو شده":
        return { text: colors.error, bg: colors.error + "15" };
      default:
        return { text: colors.textSecondary, bg: colors.backgroundSecondary };
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "تحویل شده":
        return { text: colors.success, bg: colors.success + "15" };
      case "در حال ارسال":
        return { text: colors.primary, bg: colors.primary + "15" };
      case "آماده ارسال":
        return { text: colors.warning, bg: colors.warning + "15" };
      case "لغو شده":
        return { text: colors.error, bg: colors.error + "15" };
      default:
        return { text: colors.textSecondary, bg: colors.backgroundSecondary };
    }
  };

  const totalPurchases = purchaseHistory.length;
  const totalAmount = purchaseHistory.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalQuantity = purchaseHistory.reduce((sum, item) => sum + item.quantity, 0);

  const exportToPDF = async () => {
    const modalContent = document.getElementById('purchase-history-content');
    if (!modalContent) return;

    try {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      container.style.padding = '40px';
      container.style.backgroundColor = '#ffffff';
      container.style.fontFamily = "'Yekan Bakh', 'Yekan Bakh FaNum', sans-serif";
      container.style.direction = 'rtl';
      document.body.appendChild(container);

      // Header
      const header = document.createElement('div');
      header.style.borderBottom = `3px solid ${colors.primary}`;
      header.style.paddingBottom = '20px';
      header.style.marginBottom = '30px';
      header.innerHTML = `
        <h1 style="font-size: 28px; font-weight: bold; color: #1c1c1c; margin: 0 0 10px 0;">تاریخچه خریدها</h1>
        <p style="font-size: 16px; color: #585757; margin: 0;">${customerName} • ${phoneNumber}</p>
        <p style="font-size: 14px; color: #585757; margin: 5px 0 0 0;">مجموع ${totalPurchases} خرید • ${totalAmount.toLocaleString('fa-IR')} تومان</p>
      `;
      container.appendChild(header);

      // Summary Stats
      const stats = document.createElement('div');
      stats.style.display = 'grid';
      stats.style.gridTemplateColumns = '1fr 1fr 1fr';
      stats.style.gap = '15px';
      stats.style.marginBottom = '30px';
      stats.innerHTML = `
        <div style="background-color: #f7f9fb; border: 1px solid #e8e8e8; border-radius: 12px; padding: 15px; text-align: center;">
          <div style="font-size: 12px; color: #585757; margin-bottom: 5px;">تعداد خرید</div>
          <div style="font-size: 20px; font-weight: bold; color: #1c1c1c;">${totalPurchases}</div>
        </div>
        <div style="background-color: #f7f9fb; border: 1px solid #e8e8e8; border-radius: 12px; padding: 15px; text-align: center;">
          <div style="font-size: 12px; color: #585757; margin-bottom: 5px;">تعداد محصول</div>
          <div style="font-size: 20px; font-weight: bold; color: #1c1c1c;">${totalQuantity}</div>
        </div>
        <div style="background-color: #f7f9fb; border: 1px solid #e8e8e8; border-radius: 12px; padding: 15px; text-align: center;">
          <div style="font-size: 12px; color: #585757; margin-bottom: 5px;">مجموع مبلغ</div>
          <div style="font-size: 20px; font-weight: bold; color: ${colors.primary};">${totalAmount.toLocaleString('fa-IR')}</div>
        </div>
      `;
      container.appendChild(stats);

      // Purchases list
      purchaseHistory.forEach((purchase, index) => {
        const purchaseDiv = document.createElement('div');
        purchaseDiv.style.backgroundColor = '#f7f9fb';
        purchaseDiv.style.border = '1px solid #e8e8e8';
        purchaseDiv.style.borderRadius = '12px';
        purchaseDiv.style.padding = '20px';
        purchaseDiv.style.marginBottom = '15px';

        const paymentColor = purchase.paymentStatus === 'پرداخت شده' ? '#00c853' : purchase.paymentStatus === 'در انتظار' ? '#ff9800' : '#e92c2c';
        const orderColor = purchase.orderStatus === 'تحویل شده' ? '#00c853' : purchase.orderStatus === 'در حال ارسال' ? colors.primary : purchase.orderStatus === 'آماده ارسال' ? '#ff9800' : '#e92c2c';
        
        purchaseDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div>
              <div style="font-size: 16px; font-weight: bold; color: #1c1c1c; margin-bottom: 8px;">
                فاکتور ${purchase.invoiceNumber} - ${purchase.date}
              </div>
              <div style="font-size: 14px; color: #585757; margin-bottom: 5px;">
                ${purchase.productName}
              </div>
              <div style="font-size: 14px; color: #585757;">
                تعداد: ${purchase.quantity} • قیمت واحد: ${purchase.unitPrice.toLocaleString('fa-IR')} تومان
              </div>
            </div>
            <div style="text-align: left;">
              <div style="font-size: 18px; font-weight: bold; color: ${colors.primary}; margin-bottom: 8px;">
                ${purchase.totalPrice.toLocaleString('fa-IR')} تومان
              </div>
              <div style="display: flex; gap: 5px; justify-content: flex-end;">
                <div style="background-color: ${paymentColor}20; color: ${paymentColor}; padding: 4px 12px; border-radius: 15px; font-size: 11px; font-weight: 500;">
                  ${purchase.paymentStatus}
                </div>
                <div style="background-color: ${orderColor}20; color: ${orderColor}; padding: 4px 12px; border-radius: 15px; font-size: 11px; font-weight: 500;">
                  ${purchase.orderStatus}
                </div>
              </div>
            </div>
          </div>
        `;
        container.appendChild(purchaseDiv);
      });

      // Render to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${customerName} - تاریخچه خریدها.pdf`);
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('خطا در ایجاد فایل PDF. لطفاً دوباره تلاش کنید.');
    }
  };

  const exportToExcel = () => {
    const worksheetData = [
      ["تاریخ", "شماره فاکتور", "محصول", "تعداد", "قیمت واحد", "مبلغ کل", "وضعیت پرداخت", "وضعیت سفارش"],
      ...purchaseHistory.map((purchase) => [
        purchase.date,
        purchase.invoiceNumber,
        purchase.productName,
        purchase.quantity,
        purchase.unitPrice,
        purchase.totalPrice,
        purchase.paymentStatus,
        purchase.orderStatus,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 }, // تاریخ
      { wch: 15 }, // شماره فاکتور
      { wch: 30 }, // محصول
      { wch: 10 }, // تعداد
      { wch: 15 }, // قیمت واحد
      { wch: 15 }, // مبلغ کل
      { wch: 15 }, // وضعیت پرداخت
      { wch: 18 }, // وضعیت سفارش
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "تاریخچه خریدها");

    XLSX.writeFile(workbook, `تاریخچه خریدها - ${customerName}.xlsx`);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col animate-fadeIn overflow-hidden"
          style={{ backgroundColor: colors.cardBackground }}
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary + "15" }}
              >
                <ShoppingCart className="w-6 h-6" style={{ color: colors.primary }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                    تاریخچه خریدها
                  </h2>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    • مجموع {totalPurchases} خرید ثبت شده
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                  {customerName} • {phoneNumber}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Summary Stats */}
          <div
            className="p-6 border-b grid grid-cols-3 gap-4"
            style={{ borderColor: colors.border }}
          >
            <div
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                تعداد خرید
              </p>
              <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {totalPurchases}
              </p>
            </div>
            <div
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                تعداد محصول
              </p>
              <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {totalQuantity}
              </p>
            </div>
            <div
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                مجموع مبلغ
              </p>
              <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                {totalAmount.toLocaleString('fa-IR')} تومان
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6" id="purchase-history-content">
            {purchaseHistory.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: colors.textSecondary }} />
                <p style={{ color: colors.textSecondary }}>
                  هیچ تاریخچه خریدی یافت نشد
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {purchaseHistory.map((purchase, index) => {
                  const paymentColors = getPaymentStatusColor(purchase.paymentStatus);
                  const orderColors = getOrderStatusColor(purchase.orderStatus);
                  
                  return (
                    <div
                      key={purchase.id}
                      className="rounded-lg p-5 border hover:shadow-md transition-all"
                      style={{
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border
                      }}
                    >
                      {/* Purchase Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center border"
                            style={{
                              backgroundColor: colors.cardBackground,
                              borderColor: colors.border
                            }}
                          >
                            <span className="text-sm font-bold" style={{ color: colors.primary }}>
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                                فاکتور {purchase.invoiceNumber}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" style={{ color: colors.textSecondary }} />
                              <span className="text-xs" style={{ color: colors.textSecondary }}>
                                {purchase.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-bold mb-2" style={{ color: colors.primary }}>
                            {purchase.totalPrice.toLocaleString('fa-IR')} تومان
                          </p>
                          <div className="flex gap-2">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: paymentColors.bg,
                                color: paymentColors.text
                              }}
                            >
                              {purchase.paymentStatus}
                            </span>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: orderColors.bg,
                                color: orderColors.text
                              }}
                            >
                              {purchase.orderStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Purchase Details */}
                      <div className="pr-13 space-y-2">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" style={{ color: colors.textSecondary }} />
                          <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                            {purchase.productName}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs" style={{ color: colors.textSecondary }}>
                          <span>تعداد: {purchase.quantity}</span>
                          <span>•</span>
                          <span>قیمت واحد: {purchase.unitPrice.toLocaleString('fa-IR')} تومان</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Export Buttons */}
          <div className="flex items-center justify-end gap-2 p-6 border-t" style={{ borderColor: colors.border }}>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-full transition-all"
              style={{ backgroundColor: colors.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">دانلود PDF</span>
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-full transition-all"
              style={{ backgroundColor: colors.success }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">دانلود Excel</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
