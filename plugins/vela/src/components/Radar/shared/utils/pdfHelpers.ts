import jsPDF from 'jspdf';

export const addPDFHeader = (
  doc: jsPDF,
  title: string,
  subtitle?: string,
): number => {
  let yPosition = 20;

  doc.setFontSize(22);
  doc.setTextColor(33, 150, 243);
  doc.text(title, 14, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, yPosition);
  yPosition += 6;

  if (subtitle) {
    doc.text(subtitle, 14, yPosition);
    yPosition += 6;
  }

  return yPosition + 9;
};

export const addPDFSection = (
  doc: jsPDF,
  title: string,
  content: string,
  yPosition: number,
  color: [number, number, number] = [33, 150, 243],
): number => {
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(18);
  doc.setTextColor(...color);
  doc.text(title, 14, yPosition);
  yPosition += 10;

  doc.setFontSize(9);
  doc.setTextColor(0);
  const lines = doc.splitTextToSize(content, 180);
  lines.forEach((line: string) => {
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, 14, yPosition);
    yPosition += 5;
  });

  return yPosition + 10;
};

export const checkPageBreak = (
  doc: jsPDF,
  yPosition: number,
  threshold: number = 250,
): number => {
  if (yPosition > threshold) {
    doc.addPage();
    return 20;
  }
  return yPosition;
};
