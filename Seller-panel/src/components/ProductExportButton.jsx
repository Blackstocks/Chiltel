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

const ProductExport = ({ data }) => {
  const formatProductData = (product) => ({
    'Product Name': product.name,
    'Main Category': product.mainCategory,
    'Brand': product.brand,
    'Model': product.model,
    'Category': product.category,
    'Type': product.type,
    'Price': `₹${(product.price * (1 - product.discount)).toFixed(2)}`,
    'Original Price': `₹${product.price}`,
    'Discount': product.discount > 0 ? `${(product.discount * 100).toFixed(2)}%` : '0%',
    'In Stock': product.inStock,
    'Status': product.requestedStatus.charAt(0).toUpperCase() + product.requestedStatus.slice(1)
  });

  const downloadCSV = () => {
    const csvData = data.map(formatProductData);
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products_export_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title and timestamp
    doc.setFontSize(16);
    doc.text('Products Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    // Define columns for the table
    const columns = [
      'Product Name',
      'Brand/Model',
      'Category',
      'Price',
      'Stock',
      'Status'
    ];

    // Prepare rows data
    const rows = data.map(product => [
      product.name,
      `${product.brand}\n${product.model}`,
      `${product.mainCategory}\n${product.category}`,
      `₹${(product.price * (1 - product.discount)).toFixed(2)}${
        product.discount > 0 ? `\n(${(product.discount * 100).toFixed(2)}% off)` : ''
      }`,
      product.inStock,
      product.requestedStatus.toUpperCase()
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
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
        4: { cellWidth: 20 },
        5: { cellWidth: 30 }
      }
    });

    doc.save(`products_report_${new Date().toISOString()}.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
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

export default ProductExport;