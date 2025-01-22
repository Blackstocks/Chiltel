import React, { useRef } from "react";

const ProductOrderChalan = () => {
  const printRef = useRef();
  const handlePrint = () => {
    const printContent = printRef.current;
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
        <html>
          <head>
            <style>
              @page { size: A4; margin: 2cm; margin-top: 0.5cm; margin-bottom: 0.5cm; }
              body { 
                font-family: -apple-system, system-ui, sans-serif;
                font-size: 12pt;
                line-height: 0.95;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 4px 8px;
                font-size: 11pt;
              }
              th {
                background-color: #00bcd4;
                color: white;
                font-weight: normal;
              }
              .text-right { text-align: right; }
              .text-xs { font-size: 10pt; }
              .font-medium { font-weight: 500; }
              .font-bold { font-weight: bold; }
              .mb-8 { margin-bottom: 2rem; }
              .mt-2 { margin-top: 0.5rem; }
              .p-2 { padding: 0.5rem; }
              .grid { display: grid; gap: 1rem; }
              .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
              .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
              .border-t { border-top: 1px solid #e5e7eb; }
              .border-r { border-right: 1px solid #e5e7eb; }
              .border-x { border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; }
              .border-b { border-bottom: 1px solid #e5e7eb; }
              .bg-cyan-500 { background-color: #00bcd4; }
              .text-white { color: white; }
              .text-cyan-500 { color: #00bcd4; }
              .pb-2 { padding-bottom: 0.5rem; }
              .mt-4 { margin-top: 1rem; }
              .whitespace-pre-line { white-space: pre-line; }


              .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
            .col-span-1 { grid-column: span 1; }
            .border-r { border-right: 1px solid #e5e7eb; }
            .p-4 { padding: 1rem; }
            .p-2 { padding: 0.5rem; }
            .mt-4 { margin-top: 1rem; }
            .mt-16 { margin-top: 4rem; }
            .mt-2 { margin-top: 0.5rem; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .justify-between { justify-content: space-between; }
            .w-32 { width: 8rem; }
            .h-32 { height: 8rem; }
            .h-8 { height: 2rem; }
            .inline-block { display: inline-block; }
            .text-right { text-align: right; }
            .bg-cyan-500 { background-color: #00bcd4; }
            .text-white { color: white; }
            

               .border-t.border-dashed { border-top: 1px dashed #000; }
            .mt-8 { margin-top: 2rem; }
            .pt-4 { padding-top: 1rem; }
            .mb-4 { margin-bottom: 1rem; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-lg { font-size: 1.125rem; }
            .font-bold { font-weight: bold; }
            .text-cyan-500 { color: #00bcd4; }
            .max-w-md { max-width: 28rem; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }


            </style>
          </head>
          <body>
          <img src="/chiltelLogo.png" style="display: none;" onload="this.style.display='block'" />
          ${printContent.innerHTML}
        </body>
        </html>
      `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  const orderDetails = {
    invoiceNumber: "CIPL/23-24/20",
    invoiceDate: "19-08-2023",
    poNumber: "CIPLQ/23-24/1",
    poDate: "17-08-2023",
    transport: {
      name: "Porter",
      vehicleNumber: "WB-05-7799",
      deliveryDate: "20-08-2023",
      deliveryLocation: "RAJABAJAR MORE",
    },
    company: {
      name: "Chiltel India Private Limited",
      address:
        "Shristi Apartment, FLAT NO-1 D/2, NOWBHANGA, SEC-IV, S/L, NORTH 24 PARGANAS, KOLKATA 700105",
      phone: "8017056667",
      email: "Info@Chiltel.Com",
      gstin: "19AAJCC9651K1Z0",
      state: "19-West Bengal",
    },
    customer: {
      name: "Danish Music House Private Limited",
      address:
        "GR-FR, 155/2 GROUND FLOOR FIRST FLR, KESHAB CHANDRA SEN STREET, KOLKATA, WEST BENGAL, 700009",
      contact: "9830186398",
      gstin: "19AAJCD0841N1ZB",
      state: "19-West Bengal",
    },
    bank: {
      name: "STATE BANK OF INDIA, GARFA",
      accountNo: "040683332688",
      ifsc: "SBIN0001450",
      accountHolder: "Chiltel India Private Limited",
    },
    items: [
      {
        name: "EF 335 SDG (00254)",
        serialNumbers: ["SVEF335SDG221100187", "SVEF335SDG221100103"],
        hsn: "84183010",
        mrp: 32500.0,
        quantity: 2,
        unit: "Nos",
        unitPrice: 16101.69,
        taxableAmount: 32203.39,
        cgst: 2898.31,
        sgst: 2898.31,
        total: 38000.0,
      },
    ],
    totals: {
      cgst: 5796.62,
      sgst: 5796.62,
      subTotal: 38000.0,
      total: 49593.24,
    },
    amounts: {
      subTotal: 38000.0,
      received: 0.0,
      balance: 38000.0,
      previousBalance: 0.0,
      currentBalance: 38000.0,
      youSaved: 27000.0,
    },
  };

  return (
    <div className="max-h-[80vh] bg-gray-50 rounded-lg overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div
          ref={printRef}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div className="p-8">
            {/* Header */}
            <div className="text-center border-b pb-6 mb-6">
              <h1 className="text-3xl font-bold mb-2">Tax Invoice</h1>
            </div>

            {/* Company Info */}

            {/* Invoice title and company details */}
            <div className="flex mb-8">
              <div className="w-48">
                <img
                  src="/chiltelLogo.png"
                  alt="Chiltel Logo"
                  className="w-32 p-4"
                />
              </div>
              <div className="flex">
                <div className="text-right">
                  <h2 className="font-bold text-lg">
                    {orderDetails.company.name}
                  </h2>
                  <p className="whitespace-pre-line">
                    {orderDetails.company.address}
                  </p>
                  <p>
                    Phone no.: {orderDetails.company.phone} Email:{" "}
                    {orderDetails.company.email}
                  </p>
                  <p>
                    GSTIN: {orderDetails.company.gstin}, State:{" "}
                    {orderDetails.company.state}
                  </p>
                </div>
              </div>
            </div>

            {/* Bill To, Transportation Details, Invoice Details */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div>
                <h2 className="font-bold text-lg mb-4">Bill To</h2>
                <p className="font-medium">{orderDetails.customer.name}</p>
                <p className="whitespace-pre-line">
                  {orderDetails.customer.address}
                </p>
                <p>Contact No.: {orderDetails.customer.contact}</p>
                <p>GSTIN: {orderDetails.customer.gstin}</p>
                <p>State: {orderDetails.customer.state}</p>
                <p>Place of supply: {orderDetails.customer.state}</p>
              </div>
              <div>
                <h2 className="font-bold text-lg mb-4">
                  Transportation Details
                </h2>
                <p>Transport Name: {orderDetails.transport.name}</p>
                <p>Vehicle Number: {orderDetails.transport.vehicleNumber}</p>
                <p>Delivery Date: {orderDetails.transport.deliveryDate}</p>
                <p>
                  Delivery Location: {orderDetails.transport.deliveryLocation}
                </p>
              </div>
              <div className="text-right">
                <p className="mb-2">
                  Invoice No.: {orderDetails.invoiceNumber}
                </p>
                <p className="mb-2">Date: {orderDetails.invoiceDate}</p>
                <p className="mb-2">PO Number: {orderDetails.poNumber}</p>
                <p>PO Date: {orderDetails.poDate}</p>
              </div>
            </div>

            <div className="mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-cyan-500 text-white">
                    <th className="border px-2 py-1 text-left">#</th>
                    <th className="border px-2 py-1 text-left">Item name</th>
                    <th className="border px-2 py-1 text-left">HSN/SAC</th>
                    <th className="border px-2 py-1 text-right">MRP</th>
                    <th className="border px-2 py-1 text-right">Quantity</th>
                    <th className="border px-2 py-1 text-right">Price/Unit</th>
                    <th className="border px-2 py-1 text-right">
                      Taxable Price/Unit
                    </th>
                    <th className="border px-2 py-1 text-right">
                      Taxable amount
                    </th>
                    <th className="border px-2 py-1 text-right">CGST</th>
                    <th className="border px-2 py-1 text-right">SGST</th>
                    <th className="border px-2 py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-2 py-1">{index + 1}</td>
                      <td className="border px-2 py-1">
                        {item.name}
                        <div className="text-xs">
                          Serial No.: {item.serialNumbers.join(", ")}
                        </div>
                      </td>
                      <td className="border px-2 py-1">{item.hsn}</td>
                      <td className="border px-2 py-1 text-right">
                        ₹{item.mrp.toLocaleString()}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {item.quantity} Nos
                      </td>
                      <td className="border px-2 py-1 text-right">
                        ₹{item.unitPrice.toLocaleString()}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        ₹{item.unitPrice.toLocaleString()}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        ₹{item.taxableAmount.toLocaleString()}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        ₹{item.cgst.toLocaleString()} (9%)
                      </td>
                      <td className="border px-2 py-1 text-right">
                        ₹{item.sgst.toLocaleString()} (9%)
                      </td>
                      <td className="border px-2 py-1 text-right font-medium">
                        ₹{item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan="7"
                      className="border px-2 py-1 text-right font-bold"
                    >
                      Total
                    </td>
                    <td className="border px-2 py-1 text-right">
                      ₹
                      {orderDetails.items
                        .reduce((sum, item) => sum + item.taxableAmount, 0)
                        .toLocaleString()}
                    </td>
                    <td className="border px-2 py-1 text-right">
                      ₹
                      {orderDetails.items
                        .reduce((sum, item) => sum + item.cgst, 0)
                        .toLocaleString()}
                    </td>
                    <td className="border px-2 py-1 text-right">
                      ₹
                      {orderDetails.items
                        .reduce((sum, item) => sum + item.sgst, 0)
                        .toLocaleString()}
                    </td>
                    <td className="border px-2 py-1 text-right font-bold">
                      ₹
                      {orderDetails.items
                        .reduce((sum, item) => sum + item.total, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Tax details and Amounts */}
              <div className="grid grid-cols-2 border-t border-gray-200 mt-2">
                <div className="border-r p-2">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td colSpan="2" className="font-bold">
                          Tax details
                        </td>
                        <td className="text-right">9%</td>
                      </tr>
                      <tr>
                        <td>CGST</td>
                        <td className="text-right">
                          ₹{orderDetails.totals.cgst.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>SGST</td>
                        <td className="text-right">
                          ₹{orderDetails.totals.sgst.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {/* Amount in Words and Payment Mode */}
                  <div className="mt-4">
                    <div className="bg-cyan-500 text-white p-2 font-medium">
                      Invoice Amount In Words
                    </div>
                    <div className="p-2 border-x border-b">
                      Thirty Eight Thousand Rupees only
                    </div>
                    <div className="bg-cyan-500 text-white p-2 font-medium mt-2">
                      Payment mode
                    </div>
                    <div className="p-2 border-x border-b">Credit</div>
                  </div>
                </div>
                <div className="p-2">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td colSpan="2" className="font-bold pb-2">
                          Amounts:
                        </td>
                      </tr>
                      <tr>
                        <td>Sub Total</td>
                        <td className="text-right">
                          ₹{orderDetails.totals.subTotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td className="text-right">
                          ₹{orderDetails.totals.total.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Received</td>
                        <td className="text-right">
                          ₹{orderDetails.amounts.received.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Balance</td>
                        <td className="text-right">
                          ₹{orderDetails.amounts.balance.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Previous Balance</td>
                        <td className="text-right">
                          ₹{orderDetails.amounts.previousBalance.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Current Balance</td>
                        <td className="text-right">
                          ₹{orderDetails.amounts.currentBalance.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="text-cyan-500">
                        <td>You Saved</td>
                        <td className="text-right">
                          ₹{orderDetails.amounts.youSaved.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer Sections */}
            {/* Footer Section */}
            <div className="grid grid-cols-3 border-t border-gray-200 mt-4">
              {/* Terms & Bank Details */}
              <div className="col-span-1 border-r">
                <div className="bg-cyan-500 text-white p-2">
                  Terms and Conditions
                </div>
                <p className="">100% Advance Payment with PO.</p>
                <p className="">Thanks for doing business with us!</p>

                <div className="bg-cyan-500 text-white p-2 mt-4">
                  Bank details:
                </div>
                <div className="">
                  <p>Bank Name: {orderDetails.bank.name}</p>
                  <p>Bank Account No.: {orderDetails.bank.accountNo}</p>
                  <p>Bank IFSC code: {orderDetails.bank.ifsc}</p>
                  <p>
                    Account holder's name: {orderDetails.bank.accountHolder}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="p-4 flex flex-col items-center justify-center">
                <img
                  src="/api/placeholder/150/150"
                  alt="QR Code"
                  className="w-32 h-32"
                />
                <div className="mt-2">
                  <img
                    src="/api/placeholder/100/30"
                    alt="UPI Pay"
                    className="h-8"
                  />
                </div>
              </div>

              {/* Signature */}
              <div className="p-4 flex flex-col justify-between">
                <div className="text-right">
                  <p>For, {orderDetails.company.name}</p>
                  <div className="mt-16">
                    <img
                      src="/api/placeholder/100/50"
                      alt="Signature"
                      className="inline-block"
                    />
                    <p>Authorized Signatory</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acknowledgement Section */}
            <div className="border-t border-dashed mt-8 pt-4">
              <div className="text-center font-bold mb-4">ACKNOWLEDGEMENT</div>
              <div className="text-center text-lg text-cyan-500 font-bold mb-4">
                CHILTEL INDIA PRIVATE LIMITED
              </div>

              <div className="grid grid-cols-2">
                <div>
                  <div className="font-bold">
                    DANISH MUSIC HOUSE PRIVATE LIMITED
                  </div>
                  <div className="max-w-md">
                    GR-FR, 155/2 GROUND FLOOR FIRST FLR, KESHAB CHANDRA SEN
                    STREET, GR-FR, 155/2 GROUND FLOOR FIRST FLR, KOLKATA, WEST
                    BENGAL, 700009
                  </div>
                  <div className="mt-8">Receiver's Seal & Sign</div>
                </div>
                <div className="text-right">
                  <div>INVOICE NO. : {orderDetails.invoiceNumber}</div>
                  <div>INVOICE DATE : {orderDetails.invoiceDate}</div>
                  <div>
                    INVOICE AMOUNT : ₹
                    {orderDetails.totals.total.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductOrderChalan;
