import jsPDF from 'jspdf';
import { SpecDocuments } from '../types';
import { addPDFHeader, addPDFSection, checkPageBreak } from '../../shared/utils/pdfHelpers';

interface PDFExportOptions {
  documents: Partial<SpecDocuments>;
  sourceUrl: string;
  fileName?: string;
}

export const exportToPDF = async ({
  documents,
  sourceUrl,
  fileName = 'openspec-document.pdf',
}: PDFExportOptions): Promise<void> => {
  const doc = new jsPDF();
  let yPosition = addPDFHeader(doc, 'OpenSpec Document', `Source: ${sourceUrl}`);

  // Table of Contents
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text('Table of Contents', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  const sections = [];
  if (documents.requirements) sections.push('1. Requirements');
  if (documents.design) sections.push('2. Design');
  if (documents.tasks) sections.push('3. Implementation Tasks');

  sections.forEach(section => {
    doc.text(section, 20, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // Requirements Section
  if (documents.requirements) {
    yPosition = checkPageBreak(doc, yPosition);
    yPosition = addPDFSection(doc, 'Requirements', documents.requirements, yPosition, [33, 150, 243]);
  }

  // Design Section
  if (documents.design) {
    yPosition = checkPageBreak(doc, yPosition);
    yPosition = addPDFSection(doc, 'Design', documents.design, yPosition, [76, 175, 80]);
  }

  // Tasks Section
  if (documents.tasks) {
    yPosition = checkPageBreak(doc, yPosition);
    yPosition = addPDFSection(doc, 'Implementation Tasks', documents.tasks, yPosition, [255, 152, 0]);
  }

  // Save PDF
  doc.save(fileName);
};
