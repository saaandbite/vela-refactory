import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVData, AnalysisResult } from '../types';
import { addPDFHeader, checkPageBreak } from '../../shared/utils/pdfHelpers';

interface PDFExportOptions {
  csvData: CSVData;
  analysisResult: AnalysisResult;
  fileName?: string;
}

export const exportToPDF = async ({
  csvData,
  analysisResult,
  fileName = 'csv-analysis-report.pdf',
}: PDFExportOptions): Promise<void> => {
  const doc = new jsPDF();
  let yPosition = addPDFHeader(doc, 'CSV Analysis Report');

  // Summary Section
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Data Summary', 14, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.text(`Total Rows: ${csvData.rowCount}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Total Columns: ${csvData.headers.length}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Columns: ${csvData.headers.join(', ')}`, 14, yPosition);
  yPosition += 15;

  // Sentiment Analysis Section
  if (analysisResult.sentiment) {
    doc.setFontSize(14);
    doc.text('Sentiment Analysis', 14, yPosition);
    yPosition += 8;

    const { positive, negative, neutral } = analysisResult.sentiment;
    const total = positive + negative + neutral;

    doc.setFontSize(10);
    doc.text(`Positive: ${positive} (${((positive / total) * 100).toFixed(1)}%)`, 14, yPosition);
    yPosition += 6;
    doc.text(`Negative: ${negative} (${((negative / total) * 100).toFixed(1)}%)`, 14, yPosition);
    yPosition += 6;
    doc.text(`Neutral: ${neutral} (${((neutral / total) * 100).toFixed(1)}%)`, 14, yPosition);
    yPosition += 10;

    // Sentiment Chart (simple bar representation)
    drawSentimentChart(doc, analysisResult.sentiment, yPosition);
    yPosition += 40;

    // Sentiment Details Table
    yPosition = checkPageBreak(doc, yPosition);

    doc.setFontSize(12);
    doc.text('Sentiment Details', 14, yPosition);
    yPosition += 5;

    const sentimentTableData = analysisResult.sentiment.data.slice(0, 20).map(item => [
      item.text.substring(0, 60) + (item.text.length > 60 ? '...' : ''),
      item.sentiment,
      item.score.toFixed(2),
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Text', 'Sentiment', 'Score']],
      body: sentimentTableData,
      theme: 'striped',
      headStyles: { fillColor: [33, 150, 243] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Topics Analysis Section
  if (analysisResult.topics) {
    yPosition = checkPageBreak(doc, yPosition);

    doc.setFontSize(14);
    doc.text('Topic Analysis', 14, yPosition);
    yPosition += 8;

    const topicsTableData = analysisResult.topics.topics.map(topic => [
      topic.name,
      topic.keywords.join(', '),
      topic.count.toString(),
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Topic', 'Keywords', 'Count']],
      body: topicsTableData,
      theme: 'striped',
      headStyles: { fillColor: [76, 175, 80] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 110 },
        2: { cellWidth: 25 },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Data Preview Section
  yPosition = checkPageBreak(doc, yPosition, 220);

  doc.setFontSize(14);
  doc.text('Data Preview (First 50 rows)', 14, yPosition);
  yPosition += 5;

  const previewData = csvData.rows.slice(0, 50).map(row =>
    row.map(cell => {
      const cellStr = String(cell || '');
      return cellStr.length > 30 ? cellStr.substring(0, 30) + '...' : cellStr;
    }),
  );

  autoTable(doc, {
    startY: yPosition,
    head: [csvData.headers],
    body: previewData,
    theme: 'grid',
    headStyles: { fillColor: [96, 125, 139] },
    styles: { fontSize: 7, cellPadding: 2 },
    columnStyles: csvData.headers.reduce((acc, _, idx) => {
      acc[idx] = { cellWidth: 'auto' };
      return acc;
    }, {} as any),
  });

  // Save PDF
  doc.save(fileName);
};

const drawSentimentChart = (
  doc: jsPDF,
  sentiment: { positive: number; negative: number; neutral: number },
  startY: number,
): void => {
  const { positive, negative, neutral } = sentiment;
  const total = positive + negative + neutral;
  const maxBarWidth = 150;

  const chartX = 14;
  let chartY = startY;

  doc.setFontSize(10);

  // Positive bar
  const positiveWidth = (positive / total) * maxBarWidth;
  doc.setFillColor(76, 175, 80);
  doc.rect(chartX + 40, chartY, positiveWidth, 8, 'F');
  doc.setTextColor(0);
  doc.text(`Positive: ${positive}`, chartX, chartY + 6);
  chartY += 12;

  // Negative bar
  const negativeWidth = (negative / total) * maxBarWidth;
  doc.setFillColor(244, 67, 54);
  doc.rect(chartX + 40, chartY, negativeWidth, 8, 'F');
  doc.text(`Negative: ${negative}`, chartX, chartY + 6);
  chartY += 12;

  // Neutral bar
  const neutralWidth = (neutral / total) * maxBarWidth;
  doc.setFillColor(158, 158, 158);
  doc.rect(chartX + 40, chartY, neutralWidth, 8, 'F');
  doc.text(`Neutral: ${neutral}`, chartX, chartY + 6);
};
