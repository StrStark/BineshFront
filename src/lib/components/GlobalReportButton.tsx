"use client"

import { Download, FileSpreadsheet, FileText, FilePieChart, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useReportData } from "../contexts/ReportDataContext";
import { useAppSelector } from "../store/hooks";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

const reportFormats = [
  { id: "excel", label: "دانلود Excel", icon: FileSpreadsheet, format: ".xlsx" },
  { id: "pdf", label: "دانلود PDF", icon: FileText, format: ".pdf" },
  { id: "csv", label: "دانلود CSV", icon: FilePieChart, format: ".csv" },
];

export function GlobalReportButton() {
  const colors = useCurrentColors();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getAllReportSections } = useReportData();
  const { activeFilters } = useAppSelector((state) => state.filters);

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

  const getActiveFiltersText = (): string => {
    const filterTexts: string[] = [];
    
    Object.entries(activeFilters).forEach(([tableId, filters]) => {
      if (filters.length > 0) {
        const tableName = tableId.includes("calls") ? "تماس‌ها" : 
                         tableId.includes("customers") ? "مشتریان" :
                         tableId.includes("agents") ? "کارشناسان" : tableId;
        filterTexts.push(`${tableName}: ${filters.length} فیلتر فعال`);
      }
    });

    return filterTexts.length > 0 ? filterTexts.join(" | ") : "بدون فیلتر";
  };

  const handlePDFDownload = async () => {
    setIsOpen(false);
    const sections = getAllReportSections();

    if (sections.length === 0) {
      alert("داده‌ای برای گزارش‌گیری وجود ندارد.");
      return;
    }

    try {
      const now = new Date();
      const persianDate = now.toLocaleDateString("fa-IR");
      const persianTime = now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });

      const container = document.createElement("div");
      container.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 794px;
        padding: 40px;
        background-color: rgb(255, 255, 255);
        font-family: Vazirmatn, Tahoma, Arial, sans-serif;
        direction: rtl;
        color: rgb(28, 28, 28);
      `;
      document.body.appendChild(container);

      // Header
      const header = document.createElement("div");
      header.style.cssText = `
        background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%);
        padding: 30px;
        border-radius: 12px;
        margin-bottom: 30px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      `;
      header.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div style="text-align: left; color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.6;">
            ${persianDate}<br/>
            ${persianTime}
          </div>
          <div style="text-align: right;">
            <div style="font-size: 32px; font-weight: bold; color: rgb(255, 255, 255); margin-bottom: 8px;">
              رهگیر
            </div>
            <div style="font-size: 16px; color: rgba(255, 255, 255, 0.9);">
              سیستم مدیریت کیفیت تماس
            </div>
          </div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.2); padding: 12px 20px; border-radius: 8px; text-align: center; color: white; font-size: 14px;">
          فیلترهای اعمال شده: ${getActiveFiltersText()}
        </div>
      `;
      container.appendChild(header);

      // Sections
      sections.forEach((section, index) => {
        const sectionDiv = document.createElement("div");
        sectionDiv.style.cssText = `
          margin-bottom: 30px;
          break-inside: avoid;
        `;

        const sectionTitle = document.createElement("div");
        sectionTitle.style.cssText = `
          font-size: 22px;
          font-weight: bold;
          color: ${colors.primary};
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid ${colors.primary};
        `;
        sectionTitle.textContent = section.title;
        sectionDiv.appendChild(sectionTitle);

        if (section.data.length > 0) {
          const table = document.createElement("table");
          table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-top: 10px;
          `;

          const thead = document.createElement("thead");
          const headerRow = document.createElement("tr");
          headerRow.style.cssText = `
            background-color: ${colors.primary};
            color: white;
          `;

          const headers = section.headers || Object.keys(section.data[0]);
          headers.forEach((header) => {
            const th = document.createElement("th");
            th.style.cssText = `
              padding: 12px 8px;
              text-align: center;
              border: 1px solid rgba(255, 255, 255, 0.3);
              font-weight: bold;
            `;
            th.textContent = header;
            headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);
          table.appendChild(thead);

          const tbody = document.createElement("tbody");
          section.data.forEach((row, rowIndex) => {
            const tr = document.createElement("tr");
            tr.style.cssText = `
              background-color: ${rowIndex % 2 === 0 ? "rgb(249, 250, 251)" : "rgb(255, 255, 255)"};
            `;

            Object.values(row).forEach((value) => {
              const td = document.createElement("td");
              td.style.cssText = `
                padding: 10px 8px;
                text-align: center;
                border: 1px solid rgb(229, 231, 235);
                color: rgb(55, 65, 81);
              `;
              td.textContent = String(value);
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });
          table.appendChild(tbody);
          sectionDiv.appendChild(table);
        }

        container.appendChild(sectionDiv);
      });

      // Footer
      const footer = document.createElement("div");
      footer.style.cssText = `
        margin-top: 30px;
        padding-top: 20px;
        border-top: 2px solid rgb(229, 231, 235);
        text-align: center;
        color: rgb(107, 114, 128);
        font-size: 12px;
      `;
      footer.innerHTML = `
        <div>تعداد سکشن‌ها: ${sections.length} | تعداد کل رکوردها: ${sections.reduce((sum, s) => sum + s.data.length, 0)}</div>
        <div style="margin-top: 8px;">تولید شده توسط سیستم رهگیر - ${persianDate}</div>
      `;
      container.appendChild(footer);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(container);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`گزارش-جامع-رهگیر-${persianDate}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("خطا در تولید گزارش PDF");
    }
  };

  const handleExcelDownload = () => {
    setIsOpen(false);
    const sections = getAllReportSections();

    if (sections.length === 0) {
      alert("داده‌ای برای گزارش‌گیری وجود ندارد.");
      return;
    }

    try {
      const workbook = XLSX.utils.book_new();

      sections.forEach((section) => {
        if (section.data.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(section.data);
          XLSX.utils.book_append_sheet(workbook, worksheet, section.title);
        }
      });

      const now = new Date();
      const persianDate = now.toLocaleDateString("fa-IR").replace(/\//g, "-");
      XLSX.writeFile(workbook, `گزارش-جامع-رهگیر-${persianDate}.xlsx`);
    } catch (error) {
      console.error("Error generating Excel:", error);
      alert("خطا در تولید گزارش Excel");
    }
  };

  const handleCSVDownload = () => {
    setIsOpen(false);
    const sections = getAllReportSections();

    if (sections.length === 0) {
      alert("داده‌ای برای گزارش‌گیری وجود ندارد.");
      return;
    }

    try {
      let csvContent = "";

      sections.forEach((section, index) => {
        csvContent += `\n${section.title}\n`;
        csvContent += "=".repeat(50) + "\n";

        if (section.data.length > 0) {
          const headers = section.headers || Object.keys(section.data[0]);
          csvContent += headers.join(",") + "\n";

          section.data.forEach((row) => {
            const values = Object.values(row).map((v) => `"${v}"`);
            csvContent += values.join(",") + "\n";
          });
        }

        if (index < sections.length - 1) {
          csvContent += "\n";
        }
      });

      const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      const now = new Date();
      const persianDate = now.toLocaleDateString("fa-IR").replace(/\//g, "-");

      link.setAttribute("href", url);
      link.setAttribute("download", `گزارش-جامع-رهگیر-${persianDate}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating CSV:", error);
      alert("خطا در تولید گزارش CSV");
    }
  };

  const handleDownload = (formatId: string) => {
    switch (formatId) {
      case "excel":
        handleExcelDownload();
        break;
      case "pdf":
        handlePDFDownload();
        break;
      case "csv":
        handleCSVDownload();
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium text-white"
        style={{
          backgroundColor: colors.primary,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.primaryHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.primary;
        }}
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">گزارش جامع</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-56 rounded-xl shadow-lg border overflow-hidden z-50"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          {reportFormats.map((format) => {
            const Icon = format.icon;
            return (
              <button
                key={format.id}
                onClick={() => handleDownload(format.id)}
                className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-right"
                style={{
                  color: colors.textPrimary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon className="w-5 h-5" style={{ color: colors.primary }} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{format.label}</div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    فرمت {format.format}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}