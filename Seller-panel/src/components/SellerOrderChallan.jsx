import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Printer } from 'lucide-react';

const SellerOrderChallan = ({ orderData, sellerData }) => {
  const challanRef = useRef();

  // Sample data structure (replace with actual data in production)
  const sampleOrderData = {
    challanNo: 'CHL/23-24/156',
    orderNo: 'ORD-23456',
    date: '01-03-2025',
    customerDetails: {
      name: 'DANISH MUSIC HOUSE PRIVATE LIMITED',
      address: 'GR-FR, 155/2 GROUND FLOOR FIRST FLR, KESHAR CHANDRA SEN STREET, KOLKATA, WEST BENGAL, 700009',
      contactNo: '9830186398',
      gstin: '19AAECDD341N1ZB',
      state: '19-West Bengal',
    },
    items: [
      {
        id: 1,
        name: 'JF 335 SDG (90254)',
        hsnCode: '8418310010',
        sku: 'SWFM822300231/001ET',
        quantity: 2,
        unit: 'Nos',
        rate: 16101.69,
        taxableAmount: 32203.39,
        sgst: 2898.31,
        cgst: 2898.31,
        amount: 38000.00
      }
    ],
    totalAmount: 38000.00,
    taxDetails: {
      sgstRate: 9,
      cgstRate: 9,
      sgstAmount: 2898.31,
      cgstAmount: 2898.31,
      totalTaxAmount: 5796.62,
    },
    paymentDetails: {
      received: 0,
      balance: 38000.00
    },
    amountInWords: 'Thirty Eight Thousand Rupees only',
    terms: [
      '100% Advance Payment with PO.',
      'Thanks for doing business with us!'
    ],
    dispatchDetails: {
      dispatchDate: '02-03-2025',
      transportName: 'Porter',
      vehicleNumber: 'WB-05-7789'
    }
  };

  const sampleSellerData = {
    name: 'Chiltel India Private Limited',
    address: '2Mall Apartment, FLAT NO-1 D/2, NOWBHAINGA, SECTOR-A, NEW TOWN, RAJARHAT, KOLKATA 700156',
    phone: '9871366587',
    email: 'info@chiltel.com',
    gstin: '19AALCK9651K1ZA',
    state: '19-West Bengal',
    bankDetails: {
      bankName: 'STATE BANK OF INDIA, GARIA',
      accountNo: '04906332648',
      ifscCode: 'SBIN0001450',
      accountHolder: 'Chiltel India Private Limited'
    },
    logo: '/src/assets/logo.png' // Path to your logo
  };

  // Use actual data if provided, otherwise use sample data
  const order = orderData || sampleOrderData;
  const seller = sellerData || sampleSellerData;

  // Handle print functionality
  const handlePrint = useReactToPrint({
    contentRef: challanRef,
    documentTitle: `Challan_${order.challanNo}`,
    onAfterPrint: () => console.log('Print success')
  });

  return (
    <div className="w-full max-h-[80vh] bg-gray-50 rounded-lg overflow-y-auto">
      <div className="flex justify-end gap-2 mb-4">
        <Button 
          variant="outline" 
          onClick={handlePrint}
          className="flex items-center gap-1"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button 
          onClick={handlePrint} 
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="p-0">
        <div ref={challanRef} className="p-6 bg-white" style={{ width: '260mm', minHeight: '297mm' }}>

          {/* Seller and Challan info */}
          <div className="flex justify-between mb-4">
            {/* Seller info with logo */}
            <div className="flex items-center gap-4">
              <div className="w-24">
              <img
                  src="/chiltelLogo.png"
                  alt="Chiltel Logo"
                  className="w-32 p-4"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-blue-600">{seller.name}</h2>
                <p className="text-sm">{seller.address}</p>
                <p className="text-sm">Phone no: {seller.phone} / Email: {seller.email}</p>
                <p className="text-sm">GSTIN: {seller.gstin}, State: {seller.state}</p>
              </div>
            </div>
          </div>

          {/* Customer and Transport details */}
          <div className="grid grid-cols-12 gap-2 mb-4">
            {/* Customer details - Left section */}
            <div className="col-span-6 border border-blue-500">
              <div className="bg-blue-500 text-white p-2 font-bold">Customer Details</div>
              <div className="p-2">
                <h3 className="font-bold">{order.customerDetails.name}</h3>
                <p className="text-sm">{order.customerDetails.address}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <p>Contact No.: {order.customerDetails.contactNo}</p>
                  <p>GSTIN: {order.customerDetails.gstin}</p>
                  <p>State: {order.customerDetails.state}</p>
                </div>
              </div>
            </div>

            {/* Transportation details - Right section */}
            <div className="col-span-6 grid grid-cols-12 gap-2">
              <div className="col-span-8 border border-blue-500">
                <div className="bg-blue-500 text-white p-2 font-bold">Transportation Details</div>
                <div className="p-2 text-sm">
                  <div className="grid grid-cols-3 gap-x-1">
                    <p className="font-semibold">Transport Name:</p>
                    <p className="col-span-2">{order.dispatchDetails.transportName}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-x-1">
                    <p className="font-semibold">Vehicle Number:</p>
                    <p className="col-span-2">{order.dispatchDetails.vehicleNumber}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-x-1">
                    <p className="font-semibold">Dispatch Date:</p>
                    <p className="col-span-2">{order.dispatchDetails.dispatchDate}</p>
                  </div>
                </div>
              </div>

              <div className="col-span-4 border border-blue-500">
                <div className="bg-blue-500 text-white p-2 font-bold">Place of supply</div>
                <div className="p-2 text-sm">
                  <p>{order.customerDetails.state}</p>
                  <div className="mt-2">
                    <p className="font-semibold">Challan No.:</p>
                    <p>{order.challanNo}</p>
                  </div>
                  <div className="mt-1">
                    <p className="font-semibold">Date:</p>
                    <p>{order.date}</p>
                  </div>
                  <div className="mt-1">
                    <p className="font-semibold">Order No.:</p>
                    <p>{order.orderNo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="border border-blue-400 p-2 text-left">S.No</th>
                  <th className="border border-blue-400 p-2 text-left">Item name</th>
                  <th className="border border-blue-400 p-2 text-center">HSN/SAC</th>
                  <th className="border border-blue-400 p-2 text-center">Quantity</th>
                  <th className="border border-blue-400 p-2 text-center">Unit</th>
                  <th className="border border-blue-400 p-2 text-center">Price/Unit</th>
                  <th className="border border-blue-400 p-2 text-center">Taxable Amount</th>
                  <th className="border border-blue-400 p-2 text-center">CGST</th>
                  <th className="border border-blue-400 p-2 text-center">SGST</th>
                  <th className="border border-blue-400 p-2 text-center">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-blue-50' : ''}>
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-600">{item.sku}</div>
                    </td>
                    <td className="border border-gray-300 p-2 text-center">{item.hsnCode}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.unit}</td>
                    <td className="border border-gray-300 p-2 text-right">₹ {item.rate.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right">₹ {item.taxableAmount.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right">₹ {item.cgst.toFixed(2)}<br/><span className="text-xs">({order.taxDetails.cgstRate}%)</span></td>
                    <td className="border border-gray-300 p-2 text-right">₹ {item.sgst.toFixed(2)}<br/><span className="text-xs">({order.taxDetails.sgstRate}%)</span></td>
                    <td className="border border-gray-300 p-2 text-right font-semibold">₹ {item.amount.toFixed(2)}</td>
                  </tr>
                ))}

                <tr className="font-semibold">
                  <td colSpan="6" className="border border-gray-300 p-2 text-right">Total</td>
                  <td className="border border-gray-300 p-2 text-right">₹ {order.items.reduce((sum, item) => sum + item.taxableAmount, 0).toFixed(2)}</td>
                  <td className="border border-gray-300 p-2 text-right">₹ {order.taxDetails.cgstAmount.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2 text-right">₹ {order.taxDetails.sgstAmount.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2 text-right">₹ {order.totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax and Amount Summary */}
          <div className="flex justify-between mb-4">
            <div className="w-1/2 pr-4">
              <div className="border border-gray-300 mb-4">
                <div className="bg-blue-500 text-white p-2 font-bold text-center">Invoice Amount in Words</div>
                <div className="p-2 text-center font-semibold">{order.amountInWords}</div>
              </div>

              <div className="border border-gray-300">
                <div className="bg-blue-500 text-white p-2 font-bold">Terms and Conditions</div>
                <div className="p-2">
                  <ul className="list-disc list-inside text-sm">
                    {order.terms.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="w-1/2">
              <div className="border border-gray-300 mb-4">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="border-b border-gray-300 p-2 font-semibold">Sub Total</td>
                      <td className="border-b border-gray-300 p-2 text-right">₹ {order.items.reduce((sum, item) => sum + item.taxableAmount, 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="border-b border-gray-300 p-2 font-semibold">Total Tax</td>
                      <td className="border-b border-gray-300 p-2 text-right">₹ {order.taxDetails.totalTaxAmount.toFixed(2)}</td>
                    </tr>
                    <tr className="font-bold">
                      <td className="border-b border-gray-300 p-2">Total</td>
                      <td className="border-b border-gray-300 p-2 text-right">₹ {order.totalAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="border-b border-gray-300 p-2">Received</td>
                      <td className="border-b border-gray-300 p-2 text-right">₹ {order.paymentDetails.received.toFixed(2)}</td>
                    </tr>
                    <tr className="font-bold">
                      <td className="border-b border-gray-300 p-2">Balance</td>
                      <td className="border-b border-gray-300 p-2 text-right">₹ {order.paymentDetails.balance.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-8">
                <div className="text-center">
                  <div className="border-b border-black pb-1 mb-2">
                    <img src="/signature.png" alt="Signature" className="h-16 mx-auto" />
                  </div>
                  <p className="font-semibold">Authorized Signatory</p>
                  <p>For, {seller.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer / Tear line */}
          <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-400 text-center">
            <div className="text-center uppercase font-bold">ACKNOWLEDGEMENT</div>
            <div className="text-center font-bold text-blue-600 text-lg my-2">{seller.name}</div>

            <div className="flex justify-between mt-4">
              <div>
                <p className="font-bold">{order.customerDetails.name}</p>
                <p className="text-sm">{order.customerDetails.address}</p>
              </div>
              <div className="text-right">
                <p>CHALLAN NO.: {order.challanNo}</p>
                <p>CHALLAN DATE: {order.date}</p>
                <p>CHALLAN AMOUNT: ₹ {order.totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <div className="text-center">
                <div className="border-t border-black pt-1">
                  Receiver's Seal & Sign
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SellerOrderChallan;