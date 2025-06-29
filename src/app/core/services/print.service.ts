import { Injectable } from '@angular/core';
import { logoBase64 } from '@core/utils/base64-logo.utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  generateInvoicePdf(invoiceData: any, companyInfo: any, invoiceSummary: any): void {
    const pdf = new jsPDF();
    this.addCompanyLogo(pdf);
    let y = this.printCompanyInfo(pdf, companyInfo);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const customerBlockEndY = this.printCustomerDetails(pdf, invoiceData, pageWidth);
    const tablesStartY = Math.max(y, customerBlockEndY) + 10;

    const headerTableEndY = this.printInvoiceHeaderTable(pdf, invoiceData, tablesStartY);
    const productsTableEndY = this.printProductsTable(pdf, invoiceData.products, headerTableEndY + 10);

    this.printTotalsAndBankDetails(pdf, companyInfo, invoiceSummary, productsTableEndY + 10, pageWidth);

    pdf.output('dataurlnewwindow');
    pdf.save(`${invoiceData.invoiceNumber}.pdf`);
  }

  private addCompanyLogo(pdf: jsPDF): void {
    pdf.addImage(logoBase64, 'PNG', 18, -10, 60, 60);
  }

  private printCompanyInfo(pdf: jsPDF, company: any): number {
    let y = 35;
    pdf.setFontSize(16);
    const companyNameLines = pdf.splitTextToSize(company.name, 90);
    companyNameLines.forEach((line: string) => {
      pdf.text(line, 14, y);
      y += 6;
    });

    pdf.setFontSize(10);
    const companyDetails = [
      `CIF: ${company.cif}`,
      `Address: ${company.address}`,
      `City: ${company.city}`,
      `Postal Code: ${company.postalCode}`,
      `Phone: ${company.phone}`,
      `Email: ${company.email}`
    ];

    companyDetails.forEach(detail => {
      const lines = pdf.splitTextToSize(detail, 90);
      lines.forEach((line: any) => {
        const parts = line.split(':');
        if (parts.length > 1) {
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${parts[0]}:`, 14, y);
          const titleWidth = pdf.getTextWidth(`${parts[0]}: `);
          pdf.setFont('helvetica', 'normal');
          pdf.text(parts.slice(1).join(':').trim(), 14 + titleWidth, y);
        } else {
          pdf.setFont('helvetica', 'normal');
          pdf.text(line, 14, y);
        }
        y += 5;
      });
    });

    return y;
  }

  private printCustomerDetails(pdf: jsPDF, invoice: any, pageWidth: number): number {
    const blockWidth = 85;
    const marginRight = 12;
    const rightEdge = pageWidth - marginRight;
    const blockX = rightEdge - blockWidth;
    const startY = 16;
    let y = startY;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    const title = 'CUSTOMER DETAILS';
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, blockX + (blockWidth / 2) - (titleWidth / 2), y);

    const borderY = y + 1;
    pdf.setLineWidth(0.1);
    pdf.line(blockX, borderY, blockX + blockWidth, borderY);

    y += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    const printField = (label: string, value: string | undefined) => {
      const textValue = value ?? '';
      const text = `${label}: ${textValue}`;
      const lines = pdf.splitTextToSize(text, blockWidth - 6);

      lines.forEach((line: any, index: any) => {
        const lineX = blockX + 2;
        if (index === 0 && line.includes(':')) {
          const parts = line.split(':');
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${parts[0]}:`, lineX, y);
          const labelWidth = pdf.getTextWidth(`${parts[0]}: `);
          pdf.setFont('helvetica', 'normal');
          pdf.text(parts.slice(1).join(':').trim(), lineX + labelWidth, y);
        } else {
          pdf.text(line, lineX, y);
        }
        y += 5;
      });
    };

    printField('Name', invoice.customer.name);
    const fullAddress = `${invoice.customer.address.nameOfTheRoad ?? ''}, ${invoice.customer.address.province ?? ''} - ${invoice.customer.address.municipality ?? ''} ${invoice.customer.address.postalCode ?? ''} ${invoice.customer.address.locality ?? ''}`;
    printField('Address', fullAddress);
    printField('Email', invoice.customer.email);
    printField('Vehicle', invoice.customer.vehicle);
    printField('Plate', invoice.customer.licensePlate);
    printField('Mileage', invoice.customer.mileage ? `${invoice.customer.mileage} km` : '');
    printField('NIF', invoice.customer.nifOrCif);
    if (invoice.customer.claimNumber) printField('Claim Number', invoice.customer.claimNumber);

    const blockHeight = y - startY + 2;
    pdf.setLineWidth(0.1);
    pdf.rect(blockX, startY - 5, blockWidth, blockHeight);

    return y;
  }

  private printInvoiceHeaderTable(pdf: jsPDF, invoice: any, startY: number): number {
    autoTable(pdf, {
      startY,
      head: [['Date', 'Invoice Nº', 'NIF/CIF']],
      body: [
        [
          new Date(invoice.date).toLocaleDateString('en-GB'),
          invoice.invoiceNumber ?? 'SN',
          invoice.customer.nifOrCif ?? ''
        ]
      ],
      theme: 'grid',
      headStyles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 255, 255], textColor: 0 },
      styles: { fontSize: 10, lineWidth: 0.1, lineColor: 0 },
      columnStyles: { 0: { halign: 'center' }, 1: { halign: 'center' }, 2: { halign: 'center' } },
      margin: { left: 12, right: 12 },
    });
    return (pdf as any).lastAutoTable.finalY;
  }

  private printProductsTable(pdf: jsPDF, products: any[], startY: number): number {
    const productRows = products.map(p => [
      p.code, p.description, `${p.quantity} ${p.unit}`, `${p.price} €`, `${(p.quantity * p.price).toFixed(2)} €`
    ]);
    autoTable(pdf, {
      startY,
      head: [['Ref.', 'Description', 'Quantity', 'Price', 'Amount']],
      body: productRows,
      theme: 'grid',
      headStyles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 255, 255], textColor: 0 },
      styles: { fontSize: 10, lineWidth: 0.1, lineColor: 0 },
      columnStyles: { 0: { halign: 'center' }, 1: { cellWidth: 70, overflow: 'linebreak' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
      margin: { left: 12, right: 12 },
    });
    return (pdf as any).lastAutoTable.finalY;
  }

  private printTotalsAndBankDetails(pdf: jsPDF, company: any, summary: any, startY: number, pageWidth: number): void {
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = startY;
    if (y > pageHeight - 40) { pdf.addPage(); y = 20; }

    const boxWidth = 65;
    const boxHeight = 24;
    const boxX = pageWidth - 14 - boxWidth;
    const boxY = y;
    pdf.setLineWidth(0.1);
    pdf.roundedRect(boxX, boxY, boxWidth, boxHeight, 2, 2);

    const centerLineY = boxY + boxHeight / 2 - 3;

    pdf.setFontSize(10);
    const bankLabel = 'Bank Account:';
    const bankValue = company.bankAccount ?? '';
    const bankLabelWidth = pdf.getTextWidth(bankLabel);
    const bankValueWidth = pdf.getTextWidth(bankValue);
    const boxCenterX = boxX + boxWidth / 2;
    const offsetFromCenter = 90;
    const bankCenterX = boxCenterX - offsetFromCenter;
    const bankLabelX = bankCenterX - bankLabelWidth / 2;
    const bankValueX = bankCenterX - bankValueWidth / 2;

    pdf.text(bankLabel, bankLabelX, centerLineY);
    pdf.setFont('helvetica', 'bold');
    pdf.text(bankValue, bankValueX, centerLineY + 6);
    pdf.setFont('helvetica', 'normal');

    let lineY = boxY + 6;
    const paddingLeft = 4;
    const valueX = boxX + boxWidth - paddingLeft;

    pdf.text('Base:', boxX + paddingLeft, lineY);
    pdf.text(`${summary.base} €`, valueX, lineY, { align: 'right' });

    lineY += 6;
    pdf.text('VAT 21%:', boxX + paddingLeft, lineY);
    pdf.text(`${summary.iva} €`, valueX, lineY, { align: 'right' });

    lineY += 2;
    pdf.setLineWidth(0.1);
    pdf.line(boxX + 2, lineY, boxX + boxWidth - 2, lineY);

    lineY += 6;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Total:', boxX + paddingLeft, lineY);
    pdf.text(`${summary.total} €`, valueX, lineY, { align: 'right' });
    pdf.setFont('helvetica', 'normal');
  }
}
