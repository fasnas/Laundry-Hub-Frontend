import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axiosInstance from "../../utils/AxiosInstance";

export default function MonthlyReport() {
  const [orders, setOrders] = useState([]);
  const [laundry, setLaundry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState({});

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Generate year options (current year and past 3 years)
  const years = Array.from({length: 4}, (_, i) => new Date().getFullYear() - i);

  // Fetch profile + orders from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, profileRes] = await Promise.all([
          axiosInstance.get("/getlaundryorders"),
          axiosInstance.get("/getlogedlaundry") 
        ]);
        setOrders(ordersRes.data.items || []);
        setLaundry(profileRes.data);
      } catch (err) {
        console.error("Error fetching report data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute monthly stats whenever month/year or orders change
  useEffect(() => {
    const filtered = orders?.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getMonth() === selectedMonth && orderDate.getFullYear() === selectedYear;
    });
    
    const totalOrders = filtered?.length || 0;
    const totalRevenue = filtered?.reduce((acc, o) => acc + (o.totalPrice || 0), 0) || 0;
    const gst = Math.round(totalRevenue * 0.18 * 100) / 100;
    const totalAfterGST = Math.round((totalRevenue - gst) * 100) / 100;

    setMonthlyData({ totalOrders, totalRevenue, gst, totalAfterGST, filteredOrders: filtered });
  }, [selectedMonth, selectedYear, orders]);

  // Generate PDF Report
  const generateReport = () => {
    if (!laundry) {
      alert("Laundry information not available");
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text(`${laundry.name}`, 14, 25);
    
    doc.setFontSize(16);
    doc.setTextColor(60);
    doc.text(`Monthly Revenue Report`, 14, 35);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Period: ${months[selectedMonth]} ${selectedYear}`, 14, 45);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 55);

    // Summary Table
    const summaryData = [
      ['Metric', 'Value'],
      ['Laundry Name', laundry.name],
      ['Report Period', `${months[selectedMonth]} ${selectedYear}`],
      ['Total Orders', monthlyData.totalOrders?.toString() || '0'],
      ['Gross Revenue', `₹${(monthlyData.totalRevenue || 0).toLocaleString('en-IN')}`],
      ['GST (18%)', `₹${(monthlyData.gst || 0).toLocaleString('en-IN')}`],
      ['Net Revenue', `₹${(monthlyData.totalAfterGST || 0).toLocaleString('en-IN')}`]
    ];

    // Use autoTable correctly - it's attached to the jsPDF instance
    doc.autoTable({
      startY: 65,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 139, 202], textColor: 255 },
      margin: { left: 14, right: 14 }
    });

    let finalY = doc.lastAutoTable.finalY + 20;

    // Orders Detail Table (if there are orders)
    if (monthlyData.filteredOrders && monthlyData.filteredOrders.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text('Order Details', 14, finalY);
      
      const orderHeaders = ['Order ID', 'Date', 'Customer', 'Items', 'Amount'];
      const orderData = monthlyData.filteredOrders.map(order => [
        `#${order._id?.slice(-8) || 'N/A'}`,
        new Date(order.createdAt).toLocaleDateString('en-IN'),
        order.userId?.name || order.user?.name || 'N/A',
        order.categories?.reduce((total, cat) => 
          total + cat.products?.reduce((sum, prod) => sum + (prod.quantity || 0), 0), 0) || '0',
        `₹${(order.totalPrice || 0).toLocaleString('en-IN')}`
      ]);

      doc.autoTable({
        startY: finalY + 10,
        head: [orderHeaders],
        body: orderData,
        theme: 'striped',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [52, 152, 219], textColor: 255 },
        margin: { left: 14, right: 14 }
      });
    }

    // Save the PDF
    const fileName = `${laundry.name.replace(/\s+/g, '_')}_${months[selectedMonth]}_${selectedYear}_Report.pdf`;
    doc.save(fileName);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading report...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Revenue Report</h2>

        {/* Date Selectors */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-600">Total Orders</h3>
            <p className="text-2xl font-bold text-blue-800">{monthlyData?.totalOrders || 0}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-sm font-medium text-green-600">Gross Revenue</h3>
            <p className="text-2xl font-bold text-green-800">
              ₹{(monthlyData?.totalRevenue || 0).toLocaleString('en-IN')}
            </p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-sm font-medium text-yellow-600">GST (18%)</h3>
            <p className="text-2xl font-bold text-yellow-800">
              ₹{(monthlyData?.gst || 0).toLocaleString('en-IN')}
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="text-sm font-medium text-purple-600">Net Revenue</h3>
            <p className="text-2xl font-bold text-purple-800">
              ₹{(monthlyData?.totalAfterGST || 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Report Table */}
        <div className="overflow-x-auto bg-white rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Laundry Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GST (18%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {laundry?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {months[selectedMonth]} {selectedYear}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {monthlyData?.totalOrders || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{(monthlyData?.totalRevenue || 0).toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{(monthlyData?.gst || 0).toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  ₹{(monthlyData?.totalAfterGST || 0).toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Download Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={generateReport}
            disabled={!laundry || loading}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}