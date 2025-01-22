import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const ProductOrderChalan = () => {
  const orderData = {
    invoiceNo: "CIPL/23-24/20",
    date: "19-08-2023",
    poNumber: "CIPLQ/23-24/1",
    poDate: "17-08-2023",
    company: {
      name: "Chiltel India Private Limited",
      address:
        "Shristi Apartment, FLAT NO-1 D/2, NOWBHANGA, SEC-IV, S/L, NORTH 24 PARGANAS",
      city: "NOWBHANGA KOLKATA 700105",
      phone: "8017056667",
      email: "Info@Chiltel.Com",
      gstin: "19AAJCC9651K1Z0",
    },
    customer: {
      name: "DANISH MUSIC HOUSE PRIVATE LIMITED",
      address: "GR-FR, 155/2 GROUND FLOOR FIRST FLR, KESHAB CHANDRA SEN STREET",
      city: "Kolkata, West Bengal, 700009",
      phone: "9830186398",
      gstin: "19AAJCD0841N1ZB",
    },
    transport: {
      name: "Porter",
      vehicleNo: "WB-05-7799",
      deliveryDate: "20-08-2023",
      location: "RAJABAJAR MORE",
    },
    items: [
      {
        name: "EF 335 SDG (00254)",
        serialNo: "SVEF335SDG221100187, SVEF335SDG221100103",
        hsn: "84183010",
        mrp: 32500.0,
        quantity: 2,
        unit: "Nos",
        pricePerUnit: 16101.69,
        taxableAmount: 32203.39,
        cgst: 2898.31,
        sgst: 2898.31,
        total: 38000.0,
      },
    ],
    bankDetails: {
      name: "STATE BANK OF INDIA, GARFA",
      accountNo: "040683332688",
      ifsc: "SBIN0001450",
      accountHolder: "Chiltel India Private Limited",
    },
  };

  return (
    <div className="bg-white min-h-[80vh]">
      <style>{`
  @page {
    size: A4; /* Enforce A4 page size */
    margin: 0mm 0mm; /* Increase left and right margins */
  }
  @media print {
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      background-color: white !important;
    }
    .no-print {
      display: none !important;
    }
    .print-container {
      margin: auto !important; /* Center the content */
      width: 100%; /* Ensure full width usage */
      overflow: visible !important;
      height: auto !important;
    }
  }
`}</style>

      {/* Fixed Print Button */}
      <div className="fixed top-4 right-12 z-50 no-print">
        <button
          onClick={() => window.print()}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          <Printer className="inline-block w-5 h-5 mr-2" />
          Print
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="print-container overflow-y-auto max-h-[80vh]">
        <div className="max-w-[210mm] mx-auto bg-white p-[10mm]">
          {/* Company Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">{orderData.company.name}</h1>
            <p className="text-sm">{orderData.company.address}</p>
            <p className="text-sm">{orderData.company.city}</p>
            <p className="text-sm">
              Phone: {orderData.company.phone} | Email:{" "}
              {orderData.company.email}
            </p>
            <p className="text-sm">GSTIN: {orderData.company.gstin}</p>
          </div>

          {/* Bill To and Transport */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border rounded-md overflow-hidden">
              <div className="bg-cyan-500 text-white p-2">Bill To</div>
              <div className="p-3 text-sm">
                <p className="font-bold">{orderData.customer.name}</p>
                <p>{orderData.customer.address}</p>
                <p>{orderData.customer.city}</p>
                <p>Phone: {orderData.customer.phone}</p>
                <p>GSTIN: {orderData.customer.gstin}</p>
              </div>
            </div>
            <div className="border rounded-md overflow-hidden">
              <div className="bg-cyan-500 text-white p-2">
                Transportation Details
              </div>
              <div className="p-3 text-sm">
                <p>Transport Name: {orderData.transport.name}</p>
                <p>Vehicle Number: {orderData.transport.vehicleNo}</p>
                <p>Delivery Date: {orderData.transport.deliveryDate}</p>
                <p>Location: {orderData.transport.location}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm mb-6">
              <thead>
                <tr className="bg-cyan-500 text-white">
                  <th className="border p-2 text-left">#</th>
                  <th className="border p-2">Item Description</th>
                  <th className="border p-2">HSN/SAC</th>
                  <th className="border p-2">MRP</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Rate</th>
                  <th className="border p-2">CGST</th>
                  <th className="border p-2">SGST</th>
                  <th className="border p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">
                      {item.name}
                      <div className="text-xs text-gray-500">
                        SN: {item.serialNo}
                      </div>
                    </td>
                    <td className="border p-2 text-center">{item.hsn}</td>
                    <td className="border p-2 text-right">
                      ₹{item.mrp.toFixed(2)}
                    </td>
                    <td className="border p-2 text-center">{item.quantity}</td>
                    <td className="border p-2 text-right">
                      ₹{item.pricePerUnit.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      ₹{item.cgst.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      ₹{item.sgst.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      ₹{item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-2">Bank Details:</h3>
              <div className="text-sm">
                <p>Bank Name: {orderData.bankDetails.name}</p>
                <p>A/C No: {orderData.bankDetails.accountNo}</p>
                <p>IFSC: {orderData.bankDetails.ifsc}</p>
                <p>Account holder: {orderData.bankDetails.accountHolder}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span>₹{orderData.items[0].total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>₹{orderData.items[0].total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm border-t pt-4">
            <p className="font-bold">Terms and Conditions</p>
            <p>100% Advance Payment with PO</p>
            <p>Thanks for doing business with us!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOrderChalan;
