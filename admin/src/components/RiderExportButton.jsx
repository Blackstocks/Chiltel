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

const ExportButtons = ({ data, type }) => {
  const formatRiderData = (rider) => ({
    'Name': `${rider.firstName} ${rider.lastName}`,
    'Email': rider.email,
    'Phone': rider.phoneNumber,
    'Specializations': rider.specializations.join(', '),
    'Status': rider.status,
    'Rating': rider?.rating?.average?.toFixed(1) || '0.0',
    'Total Reviews': rider?.rating?.count || 0
  });

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
    let csvData;
    if (type === 'riders') {
      csvData = data.map(formatRiderData);
    } else {
      csvData = data.map(formatServiceData);
    }
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}_export_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    const title = type === 'riders' ? 'Riders Report' : 'Services Report';
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    let columns, rows;
    
    if (type === 'riders') {
      columns = ['Name', 'Specializations', 'Contact', 'Status', 'Rating'];
      rows = data.map(rider => [
        `${rider.firstName} ${rider.lastName}`,
        rider.specializations.join(', '),
        `${rider.phoneNumber}\n${rider.email}`,
        rider.status,
        `${rider?.rating?.average?.toFixed(1) || '0.0'} (${rider?.rating?.count || 0})`
      ]);
    } else {
      columns = ['Service Name', 'Product', 'Category', 'Price', 'Duration', 'Status'];
      rows = data.map(service => [
        service.name,
        service.product,
        service.category,
        `₹${service.price}${service.discount ? ` (-₹${service.discount})` : ''}`,
        service.estimatedDuration,
        service.isAvailable ? 'Available' : 'Unavailable'
      ]);
    }

    doc.autoTable({
      startY: 35,
      head: [columns],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: type === 'riders' ? {
        0: { cellWidth: 35 },
        1: { cellWidth: 45 },
        2: { cellWidth: 45 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 }
      } : {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 25 }
      }
    });

    doc.save(`${type}_report_${new Date().toISOString()}.pdf`);
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