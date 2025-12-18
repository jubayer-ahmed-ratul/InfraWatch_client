import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { FaDownload, FaFilePdf } from "react-icons/fa";

const AdminPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/payments/list");
      setPayments(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);


  const filterDate = new Date("2025-12-17");
  const filteredPayments = payments.filter(payment => new Date(payment.date) >= filterDate);


  const totalAmount = filteredPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const count = filteredPayments.length;

  
  const generateSinglePaymentPDF = (payment) => {
    const doc = new jsPDF();
    
  
    doc.setProperties({
      title: `Payment Receipt - ${payment.email}`,
      subject: 'Payment Receipt',
      author: 'Your App Name'
    });

   
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text("PAYMENT RECEIPT", 105, 20, { align: 'center' });
    
  
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    let yPosition = 40;
    
   
    const details = [
      { label: "Receipt ID", value: payment._id || payment.id || "N/A" },
      { label: "Date", value: new Date(payment.date).toLocaleString() },
      { label: "Customer Email", value: payment.email },
      { label: "Amount", value: `${payment.amount} BDT` },
      { label: "Payment Status", value: payment.status },
      { label: "Transaction ID", value: payment.transactionId || "N/A" },
      { label: "Payment Method", value: payment.method || "Online" }
    ];

  
    details.forEach(detail => {
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`${detail.label}:`, 20, yPosition);
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(detail.value, 70, yPosition);
      
      yPosition += 10;
    });

  
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition + 5, 190, yPosition + 5);
    
    yPosition += 15;

   
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("This is an automated receipt. Please keep this for your records.", 105, yPosition, { align: 'center' });
    
   
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 280, { align: 'center' });

 
    const fileName = `payment_${payment.email}_${new Date(payment.date).toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

 
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Admin Payments Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Total Successful Payments: ${count}`, 14, 32);
    doc.text(`Total Amount Collected: ${totalAmount} BDT`, 14, 40);
    doc.text(`Report Period: From ${filterDate.toLocaleDateString()} onwards`, 14, 48);

    const tableColumn = ["#", "Email", "Amount (BDT)", "Status", "Date"];
    const tableRows = [];

    filteredPayments.forEach((payment, index) => {
      const paymentData = [
        index + 1,
        payment.email,
        payment.amount,
        payment.status,
        new Date(payment.date).toLocaleString()
      ];
      tableRows.push(paymentData);
    });

    doc.autoTable({
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [52, 152, 219] },
    });

    doc.save("payments-report.pdf");
  };

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Payments</h1>
      
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 text-center gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Payments</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold">{totalAmount} BDT</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (BDT)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No payments found</td>
                </tr>
              ) : (
                filteredPayments.map((payment, index) => (
                  <tr key={payment.id || payment._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        payment.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.date).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => generateSinglePaymentPDF(payment)}
                        className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                        title="Download Receipt"
                      >
                        <FaDownload /> Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      <div className="mt-6 text-sm text-gray-500">
        <p>Note: This report shows payments from {filterDate.toLocaleDateString()} onwards.</p>
        <p>Click "Receipt" button to download individual payment receipt as PDF.</p>
      </div>
    </div>
  );
};

export default AdminPayments;