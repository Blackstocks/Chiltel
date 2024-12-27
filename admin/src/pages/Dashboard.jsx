import { Package, Wrench, ClipboardList, Users } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trend && (
            <p
              className={`text-sm mt-1 ${
                trend > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend > 0 ? "+" : ""}
              {trend}% from last month
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon size={24} className="text-blue-600" />
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = ({ token }) => {
  // Sample data
  const [stats, setStats] = useState({
    products: 0,
    services: 0,
    orders: 0,
    riders: 0,
  });
  //const [salesData, setSalesData] = useState([]);
  //const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/stats`, {
          headers: { token },
        }),
        //axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/sales`, { headers: { token } }),
        //axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/recent-orders`, { headers: { token } })
      ]);

      setStats({
        products: statsRes.data.products,
        services: statsRes.data.services,
        orders: statsRes.data.orders,
        riders: statsRes.data.riders,
      });
      //setSalesData(salesRes.data);
      //setRecentOrders(ordersRes.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statsCards = [
    { title: "Total Products", value: stats.products, icon: Package },
    { title: "Active Services", value: stats.services, icon: Wrench },
    { title: "Total Orders", value: stats.orders, icon: ClipboardList },
    { title: "Total Riders", value: stats.riders, icon: Users },
  ];

  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 5500 },
  ];

  const recentOrders = [
    {
      id: 1,
      customer: "John Doe",
      product: "Deep Freezer XL",
      date: "2024-12-18",
      status: "Completed",
    },
    {
      id: 2,
      customer: "Jane Smith",
      product: "AC Supreme",
      date: "2024-12-18",
      status: "Processing",
    },
    {
      id: 3,
      customer: "Bob Johnson",
      product: "Visi-Cooler Pro",
      date: "2024-12-17",
      status: "Pending",
    },
  ];

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <main className="p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat) => (
                <StatsCard key={stat.title} {...stat} />
              ))}
            </div>

            {/* Sales Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.product}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
