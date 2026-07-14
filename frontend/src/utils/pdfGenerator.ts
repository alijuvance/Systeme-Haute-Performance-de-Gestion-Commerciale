import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './formatters';

import { Sale, SaleLine } from '../types';

export const generateInvoicePdf = (invoice: Sale) => {
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(22);
  doc.text(invoice.type === 'POS' ? 'TICKET DE CAISSE' : 'FACTURE', 14, 22);
  
  doc.setFontSize(10);
  doc.text(`N°: ${invoice.invoiceNumber}`, 14, 32);
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 14, 38);
  
  // Informations Client
  const clientName = invoice.customer?.companyName || invoice.customer?.fullName || 'Client Anonyme';
  doc.text(`Client: ${clientName}`, 120, 32);
  if (invoice.customer?.address) doc.text(`${invoice.customer.address}`, 120, 38);
  if (invoice.customer?.taxId) doc.text(`NIF/STAT: ${invoice.customer.taxId}`, 120, 44);

  // Tableau des articles
  const tableData = invoice.lines?.map((line: SaleLine) => [
    line.product?.name || 'Article inconnu',
    line.quantity.toString(),
    formatCurrency(line.unitPrice),
    formatCurrency(line.quantity * line.unitPrice)
  ]) || [];

  autoTable(doc, {
    startY: 55,
    head: [['Désignation', 'Qté', 'Prix Unitaire', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: invoice.type === 'POS' ? [126, 34, 206] : [30, 64, 175] }, // violet pour POS, bleu pour Facture
  });

  // Totaux
  // @ts-ignore : jspdf-autotable adds lastAutoTable to doc
  const finalY = (doc as any).lastAutoTable?.finalY || 55;
  
  doc.setFontSize(12);
  doc.text(`Total TTC:`, 130, finalY + 15);
  doc.text(formatCurrency(invoice.totalAmount), 160, finalY + 15);
  
  doc.text(`Payé:`, 130, finalY + 23);
  doc.text(formatCurrency(invoice.amountPaid), 160, finalY + 23);
  
  const reste = invoice.totalAmount - invoice.amountPaid;
  if (reste > 0) {
    doc.setTextColor(220, 38, 38); // Rouge
    doc.text(`Reste à Payer:`, 130, finalY + 31);
    doc.text(formatCurrency(reste), 160, finalY + 31);
  }

  // Téléchargement du fichier
  doc.save(`${invoice.invoiceNumber}.pdf`);
};
