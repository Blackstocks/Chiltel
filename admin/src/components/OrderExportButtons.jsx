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
  const formatDate = (date) => new Date(date).toLocaleDateString();

  const downloadCSV = () => {
    let csvData = [];
    
    if (type === 'orders') {
      csvData = data.map(order => ({
        'Order ID': order._id,
        'Customer Name': order.userId.name,
        'Customer Email': order.userId.email,
        'Amount': order.totalAmount,
        'Status': order.status,
        'Order Date': formatDate(order.createdAt)
      }));
    } else {
      csvData = data.map(service => ({
        'Service ID': service._id,
        'Service Name': service.service?.name || '',
        'Customer Name': service.user.name,
        'Customer Email': service.user.email,
        'Amount': service.service?.price || 0,
        'Status': service.status,
        'Requested Date': formatDate(service.createdAt),
        'Scheduled Date': formatDate(service.scheduledFor)
      }));
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
    
    const title = type === 'orders' ? 'Orders Report' : 'Service Requests Report';
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    const columns = type === 'orders' 
      ? ['ID', 'Customer', 'Amount', 'Status', 'Date']
      : ['ID', 'Service', 'Customer', 'Amount', 'Status', 'Requested', 'Scheduled'];

    const rows = type === 'orders'
      ? data.map(order => [
          order._id,
          order.userId.name,
          `₹${order.totalAmount}`,
          order.status,
          formatDate(order.createdAt)
        ])
      : data.map(service => [
          service._id,
          service.service?.name || '',
          service.user.name,
          `₹${service.service?.price || 0}`,
          service.status,
          formatDate(service.createdAt),
          formatDate(service.scheduledFor)
        ]);

    doc.autoTable({
      startY: 35,
      head: [columns],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
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