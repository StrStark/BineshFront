import { Download, FileSpreadsheet, FileText, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

export interface ReportSection {
  title: string;
  data: Array<Record<string, string | number>>;
  headers?: string[];
}

interface ReportDownloadProps {
  sections?: ReportSection[];
  fileName?: string;
  onDownloadPDF?: () => void;
  onDownloadExcel?: () => void;
}

export function ReportDownload({
  sections,
  fileName = "report",
  onDownloadPDF,
  onDownloadExcel
}: ReportDownloadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const colors = useCurrentColors();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePDFDownload = async () => {
    setIsOpen(false);
    if (onDownloadPDF) {
      onDownloadPDF();
      return;
    }
   
    if (!sections || sections.length === 0) {
      alert('داده‌ای برای گزارش‌گیری وجود ندارد.');
      return;
    }

    try {
      // Get current date
      const now = new Date();
      const persianDate = `${now.toLocaleDateString('fa-IR')}`;
      const persianTime = `${now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`;

      // Landscape dimensions (A4 landscape)
      const LANDSCAPE_WIDTH_PX = 1123;   // 297mm × ~3.78 px/mm
      const LANDSCAPE_IMG_WIDTH_MM = 297;
      const LANDSCAPE_PAGE_HEIGHT_MM = 210;

      // Create temporary container (wider for landscape)
      const container = document.createElement('div');
      container.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: ${LANDSCAPE_WIDTH_PX}px;
        padding: 40px;
        background-color: rgb(255, 255, 255);
        font-family: Vazirmatn, Tahoma, Arial, sans-serif;
        direction: rtl;
        color: rgb(28, 28, 28);
      `;
      document.body.appendChild(container);

      // Add header
      const header = document.createElement('div');
      header.style.cssText = `
        background: linear-gradient(135deg, rgb(26, 31, 46) 0%, rgb(42, 49, 66) 100%);
        padding: 30px;
        border-radius: 12px;
        margin-bottom: 30px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      `;
      header.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div style="text-align: left; color: rgb(100, 181, 246); font-size: 14px; line-height: 1.6;">
            ${persianDate}<br/>
            ${persianTime}
          </div>
          <div style="text-align: right;">
            <div style="font-size: 32px; font-weight: bold; color: rgb(255, 255, 255); margin-bottom: 8px;">
              بینش
            </div>
            <div style="font-size: 16px; color: rgb(100, 181, 246);">
              پنل مدیریت داده بینش
            </div>
          </div>
        </div>
        <div style="border-top: 2px solid rgba(100, 181, 246, 0.3); padding-top: 15px;">
          <div style="font-size: 18px; font-weight: 600; color: rgb(232, 232, 232); text-align: center;">
            ${fileName}
          </div>
        </div>
      `;
      container.appendChild(header);

      // Add sections
      sections.forEach((section, sectionIndex) => {
        if (!section.data || section.data.length === 0) return;

        const sectionDiv = document.createElement('div');
        sectionDiv.style.cssText = `
          margin-bottom: 40px;
          page-break-inside: avoid;
        `;

        // Section title
        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = `
          font-size: 20px;
          font-weight: bold;
          color: rgb(26, 31, 46);
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 3px solid rgb(26, 31, 46);
        `;
        titleDiv.textContent = section.title;
        sectionDiv.appendChild(titleDiv);

        // Table
        const table = document.createElement('table');
        table.style.cssText = `
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          overflow: hidden;
        `;

        // Table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = section.headers || Object.keys(section.data[0] || {});
       
        headers.forEach(header => {
          const th = document.createElement('th');
          th.style.cssText = `
            padding: 14px 12px;
            text-align: right;
            font-size: 14px;
            font-weight: 700;
            color: rgb(255, 255, 255);
            background: linear-gradient(135deg, rgb(26, 31, 46) 0%, rgb(42, 49, 66) 100%);
            border-bottom: 2px solid rgb(100, 181, 246);
          `;
          th.textContent = header;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Table body
        const tbody = document.createElement('tbody');
        section.data.forEach((row, rowIndex) => {
          const tr = document.createElement('tr');
          tr.style.cssText = `
            background-color: ${rowIndex % 2 === 0 ? 'rgb(255, 255, 255)' : 'rgb(247, 249, 251)'};
          `;
         
          headers.forEach(header => {
            const td = document.createElement('td');
            td.style.cssText = `
              padding: 12px;
              text-align: right;
              font-size: 13px;
              color: rgb(28, 28, 28);
              border-bottom: 1px solid rgb(232, 232, 232);
            `;
            const value = row[header];
            td.textContent = value !== undefined && value !== null ? String(value) : '-';
            tr.appendChild(td);
          });
         
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        sectionDiv.appendChild(table);
        container.appendChild(sectionDiv);
      });

      // Add footer
      const footer = document.createElement('div');
      footer.style.cssText = `
        margin-top: 40px;
        padding-top: 20px;
        border-top: 2px solid rgb(232, 232, 232);
        text-align: center;
        font-size: 12px;
        color: rgb(139, 146, 168);
      `;
      footer.innerHTML = `
        <div style="margin-bottom: 8px;">سیستم هوشمند مدیریت داده بینش</div>
        <div>تاریخ و زمان تولید گزارش: ${persianDate} - ${persianTime}</div>
      `;
      container.appendChild(footer);

      // Wait a bit for fonts to load
      await new Promise(resolve => setTimeout(resolve, 100));

      // Render to canvas (landscape width)
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: LANDSCAPE_WIDTH_PX,
        windowWidth: LANDSCAPE_WIDTH_PX,
        onclone: (clonedDoc) => {
          const clonedContainer = clonedDoc.querySelector('div');
          if (clonedContainer) {
            clonedContainer.style.backgroundColor = 'rgb(255, 255, 255)';
          }
        }
      });

      // Remove container
      document.body.removeChild(container);

      // Create PDF in LANDSCAPE
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = LANDSCAPE_IMG_WIDTH_MM;
      const pageHeight = LANDSCAPE_PAGE_HEIGHT_MM;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('خطا در ایجاد فایل PDF. لطفاً دوباره تلاش کنید.');
    }
  };

  const handleExcelDownload = () => {
    setIsOpen(false);
    if (onDownloadExcel) {
      onDownloadExcel();
      return;
    }
    if (!sections || sections.length === 0) {
      alert('داده‌ای برای گزارش‌گیری وجود ندارد.');
      return;
    }
    try {
      const workbook = XLSX.utils.book_new();
     
      sections.forEach((section, index) => {
        if (!section.data || section.data.length === 0) return;
        const worksheet = XLSX.utils.json_to_sheet(section.data);
        const sheetName = section.title.substring(0, 31);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || `Sheet${index + 1}`);
      });
     
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('خطا در ایجاد فایل Excel. لطفاً دوباره تلاش کنید.');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity text-white"
        style={{
          backgroundColor: colors.primary,
        }}
      >
        <Download className="w-5 h-5" />
        <span className="hidden sm:inline">گزارش‌گیری</span>
        <span className="sm:hidden">گزارش</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 mt-2 rounded-lg shadow-xl border overflow-hidden z-50 min-w-[180px] animate-fadeIn"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border
          }}
        >
          {/* Excel Option */}
          <button
            onClick={handleExcelDownload}
            className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-right"
            style={{
              color: colors.textPrimary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <FileSpreadsheet className="w-4 h-4" style={{ color: colors.success }} />
            <div className="flex-1">
              <p className="text-sm font-medium">دانلود Excel</p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>فرمت .xlsx</p>
            </div>
          </button>

          {/* PDF Option */}
          <button
            onClick={handlePDFDownload}
            className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-right border-t"
            style={{
              color: colors.textPrimary,
              borderColor: colors.border
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <FileText className="w-4 h-4" style={{ color: colors.error }} />
            <div className="flex-1">
              <p className="text-sm font-medium">دانلود PDF</p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>فرمت .pdf (افقی)</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export { ReportSection };