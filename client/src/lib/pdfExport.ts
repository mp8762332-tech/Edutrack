/**
 * PDF Export Utility
 * Handles PDF generation from HTML using html2pdf library
 */

import html2pdf from "html2pdf.js";

export interface PDFOptions {
  filename: string;
  margin?: [number, number, number, number];
  scale?: number;
  pageWidth?: number;
  pageHeight?: number;
  orientation?: "portrait" | "landscape";
  format?: "a4" | "letter" | "a3";
  compress?: boolean;
}

/**
 * Export HTML element to PDF
 */
export async function exportElementToPDF(
  element: HTMLElement,
  options: PDFOptions
): Promise<void> {
  const defaultOptions = {
    margin: [10, 10, 10, 10] as [number, number, number, number], // mm
    filename: options.filename || "document.pdf",
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: options.scale || 2, useCORS: true },
    jsPDF: {
      unit: "mm",
      format: options.format || "a4",
      orientation: options.orientation || "portrait",
      compress: options.compress !== false,
    },
  };

  try {
    await html2pdf().set(defaultOptions).from(element).save();
  } catch (error) {
    console.error("PDF export failed:", error);
    throw error;
  }
}

/**
 * Export HTML string to PDF
 */
export async function exportHTMLStringToPDF(
  htmlString: string,
  options: PDFOptions
): Promise<void> {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  document.body.appendChild(tempDiv);

  try {
    await exportElementToPDF(tempDiv, options);
  } finally {
    document.body.removeChild(tempDiv);
  }
}

/**
 * Generate report card PDF
 */
export async function exportReportCardPDF(
  studentName: string,
  htmlElement: HTMLElement,
  term: number,
  year: number
): Promise<void> {
  const filename = `${studentName}_ReportCard_T${term}_${year}.pdf`;

  await exportElementToPDF(htmlElement, {
    filename,
    margin: [10, 10, 10, 10] as [number, number, number, number],
    scale: 2,
    format: "a4",
    orientation: "portrait",
    compress: true,
  });
}

/**
 * Generate timetable PDF
 */
export async function exportTimetablePDF(
  className: string,
  htmlElement: HTMLElement,
  timetableType: string
): Promise<void> {
  const filename = `${className}_${timetableType}_Timetable.pdf`;

  await exportElementToPDF(htmlElement, {
    filename,
    margin: [10, 10, 10, 10] as [number, number, number, number],
    scale: 2,
    format: "a4",
    orientation: "landscape",
    compress: true,
  });
}

/**
 * Generate attendance report PDF
 */
export async function exportAttendanceReportPDF(
  className: string,
  month: string,
  htmlElement: HTMLElement
): Promise<void> {
  const filename = `${className}_Attendance_${month}.pdf`;

  await exportElementToPDF(htmlElement, {
    filename,
    margin: [10, 10, 10, 10] as [number, number, number, number],
    scale: 2,
    format: "a4",
    orientation: "landscape",
    compress: true,
  });
}

/**
 * Generate bulk report cards PDF (multiple pages)
 */
export async function exportBulkReportCardsPDF(
  schoolName: string,
  className: string,
  htmlElements: HTMLElement[]
): Promise<void> {
  const filename = `${schoolName}_${className}_ReportCards.pdf`;

  const defaultOptions = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait" as const,
      compress: true,
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  }

  try {
    // For bulk PDFs, we'll create separate PDFs and let user combine them
    // or use a simpler approach of concatenating HTML
    const container = document.createElement("div");
    htmlElements.forEach((el) => {
      const clone = el.cloneNode(true);
      container.appendChild(clone);
      const pageBreak = document.createElement("div");
      pageBreak.style.pageBreakAfter = "always";
      container.appendChild(pageBreak);
    });

    await html2pdf().set(defaultOptions).from(container).save();
  } catch (error) {
    console.error("Bulk PDF export failed:", error);
    throw error;
  }
}

/**
 * Download file directly
 */
export function downloadFile(content: string, filename: string, mimeType: string = "text/plain"): void {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  downloadFile(csvContent, filename, "text/csv");
}

/**
 * Download JSON file
 */
export function downloadJSON(data: any, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, filename, "application/json");
}

/**
 * Share via WhatsApp
 */
export function shareViaWhatsApp(message: string, phoneNumber?: string): void {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = phoneNumber
    ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
}

/**
 * Share via Email
 */
export function shareViaEmail(
  to: string,
  subject: string,
  body: string,
  cc?: string,
  bcc?: string
): void {
  const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${
    cc ? `&cc=${encodeURIComponent(cc)}` : ""
  }${bcc ? `&bcc=${encodeURIComponent(bcc)}` : ""}`;

  window.location.href = mailtoLink;
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Print HTML element
 */
export function printElement(element: HTMLElement, title: string = "Document"): void {
  const printWindow = window.open("", "", "width=800,height=600");
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            * { box-sizing: border-box; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
}

/**
 * Generate QR code link for sharing
 */
export function generateShareLink(baseUrl: string, data: Record<string, string>): string {
  const params = new URLSearchParams(data);
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Get browser print settings
 */
export function getPrintSettings(): {
  paperSize: string;
  orientation: string;
  margins: string;
} {
  return {
    paperSize: "A4",
    orientation: "portrait",
    margins: "10mm",
  };
}
