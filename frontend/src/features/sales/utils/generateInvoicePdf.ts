import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from '@/utils/formatters';

export const generateInvoicePdf = (sale: any) => {
  const doc = new jsPDF();
  
  // En-tête de l'entreprise (à personnaliser ou rendre dynamique plus tard)
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('ERP SYSTEM', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('123 Rue de l\'Innovation', 14, 28);
  doc.text('101 Antananarivo, Madagascar', 14, 33);
  doc.text('NIF : 1234567890 | STAT : 0987654321', 14, 38);

  // Info Facture
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text(`FACTURE N° : ${sale.invoiceNumber}`, 130, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date : ${formatDate(sale.date || sale.createdAt)}`, 130, 28);
  doc.text(`Échéance : ${sale.dueDate ? formatDate(sale.dueDate) : 'À réception'}`, 130, 33);
  doc.text(`Statut : ${sale.status}`, 130, 38);

  // Info Client
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(14, 45, 196, 45);

  doc.setFontSize(11);
  doc.setTextColor(40);
  doc.text('Facturé à :', 14, 52);
  
  doc.setFontSize(10);
  doc.setTextColor(80);
  if (sale.customer) {
    const customerName = sale.customer.companyName || sale.customer.fullName || 'Client Inconnu';
    doc.text(customerName, 14, 58);
    if (sale.customer.address) doc.text(sale.customer.address, 14, 63);
    if (sale.customer.phone) doc.text(`Tél : ${sale.customer.phone}`, 14, 68);
    if (sale.customer.taxId) doc.text(`NIF : ${sale.customer.taxId}`, 14, 73);
  } else {
    doc.text('Client Standard', 14, 58);
  }

  // Tableau des lignes
  const tableData = sale.lines?.map((line: any) => [
    line.product?.name || line.productId,
    line.quantity.toString(),
    formatCurrency(line.unitPrice),
    line.discount ? `${line.discount}%` : '-',
    formatCurrency(line.quantity * line.unitPrice * (1 - (line.discount || 0) / 100))
  ]) || [];

  autoTable(doc, {
    startY: 85,
    head: [['Description', 'Qté', 'Prix Unitaire', 'Remise', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [17, 24, 39], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'center' },
      4: { halign: 'right' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Résumé
  doc.setFontSize(10);
  doc.setTextColor(40);
  const totalLabelX = 130;
  const totalValueX = 180;

  const totalHT = sale.totalAmount / 1.2; // Supposons TVA 20% si taxAmount n'est pas utilisé directement
  const taxAmount = sale.taxAmount || (sale.totalAmount - totalHT);

  doc.text('Sous-total HT :', totalLabelX, finalY);
  doc.text(formatCurrency(totalHT), totalValueX, finalY, { align: 'right' });

  doc.text('TVA (20%) :', totalLabelX, finalY + 7);
  doc.text(formatCurrency(taxAmount), totalValueX, finalY + 7, { align: 'right' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL TTC :', totalLabelX, finalY + 15);
  doc.text(formatCurrency(sale.totalAmount), totalValueX, finalY + 15, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Montant payé :', totalLabelX, finalY + 22);
  doc.text(formatCurrency(sale.amountPaid), totalValueX, finalY + 22, { align: 'right' });
  
  doc.setTextColor(sale.totalAmount > sale.amountPaid ? 220 : 40, 38, 38);
  doc.text('Reste à payer :', totalLabelX, finalY + 29);
  doc.text(formatCurrency(sale.totalAmount - sale.amountPaid), totalValueX, finalY + 29, { align: 'right' });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  const pageHeight = doc.internal.pageSize.height;
  doc.text('Merci pour votre confiance.', 105, pageHeight - 15, { align: 'center' });
  doc.text('Les factures sont payables à réception sauf accord contraire.', 105, pageHeight - 10, { align: 'center' });

  // Télécharger le PDF
  doc.save(`Facture_${sale.invoiceNumber}.pdf`);
};
