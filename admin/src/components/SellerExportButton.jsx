import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ExportButtons = ({ data }) => {
  const formatSellerData = (seller) => ({
    'Shop Name': seller.shopName,
    'Proprietor Name': seller.proprietorName,
    'Email': seller.email,
    'Phone': seller.phoneNumber,
    'Commission Rate': `${seller.commissionRate || 0}%`,
    'Registration Status': seller.registrationStatus,
    'GST Number': seller.gstNumber || 'N/A',
    'Registered Address': `${seller.registeredAddress.street}, ${seller.registeredAddress.city}, ${seller.registeredAddress.state} - ${seller.registeredAddress.pincode}`,
    'Warehouse Address': `${seller.warehouseAddress.street}, ${seller.warehouseAddress.city}, ${seller.warehouseAddress.state} - ${seller.warehouseAddress.pincode}`,
    'Bank Name': seller.bankDetails?.bankName || 'N/A',
    'Account Number': seller.bankDetails?.accountNumber || 'N/A',
    'IFSC Code': seller.bankDetails?.ifscCode || 'N/A'
  });

  const downloadCSV = () => {
    const csvData = data.map(formatSellerData);
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sellers_export_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title and timestamp
    doc.setFontSize(16);
    doc.text('Sellers Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    // Define columns for the table
    const columns = [
      'Shop Name',
      'Proprietor',
      'Contact',
      'Location',
      'Commission',
      'Status'
    ];

    // Prepare rows data
    const rows = data.map(seller => [
      seller.shopName,
      seller.proprietorName,
      `${seller.email}\n${seller.phoneNumber}`,
      `${seller.registeredAddress.city}, ${seller.registeredAddress.state}`,
      `${seller.commissionRate || 0}%`,
      seller.registrationStatus.toUpperCase()
    ]);

    // Add the table to the PDF
    doc.autoTable({
      startY: 35,
      head: [columns],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30 },
        2: { cellWidth: 45 },
        3: { cellWidth: 40 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 }
      }
    });

    doc.save(`sellers_report_${new Date().toISOString()}.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={downloadCSV} className="cursor-pointer">
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadPDF} className="cursor-pointer">
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButtons;