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
  const formatServiceData = (service) => ({
    'Service Name': service.name,
    'Description': service.description,
    'Product Type': service.product,
    'Category': service.category,
    'Price': `₹${service.price}`,
    'Discount': service.discount ? `₹${service.discount}` : '0',
    'Duration': service.estimatedDuration,
    'Status': service.isAvailable ? 'Available' : 'Unavailable',
    'Requirements': service.requirements?.join(', ') || ''
  });

  const downloadCSV = () => {
    let csvData = data.map(formatServiceData);
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `services_export_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title and timestamp
    doc.setFontSize(16);
    doc.text('Services Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    // Define columns for the table
    const columns = [
      'Service Name',
      'Product',
      'Category',
      'Price',
      'Duration',
      'Status'
    ];

    // Prepare rows data
    const rows = data.map(service => [
      service.name,
      service.product,
      service.category,
      `₹${service.price}${service.discount ? ` (-₹${service.discount})` : ''}`,
      service.estimatedDuration,
      service.isAvailable ? 'Available' : 'Unavailable'
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
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 25 }
      }
    });

    doc.save(`services_report_${new Date().toISOString()}.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
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