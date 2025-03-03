import { useState, useEffect, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"; // Adjust import paths as needed
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Adjust import paths as needed
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios"; // Make sure axios is installed

const RevenueDetailsSheet = ({ seller, isOpen, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState({
    overallRevenue: 0,
    monthlyRevenue: {},
    totalOrdersProcessed: 0,
    commissionRate: 0,
  });

  // Get current month in format "YYYY-MM"
  function getCurrentMonth() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  }

  // Fetch revenue data from backend
  useEffect(() => {
    const fetchRevenueData = async () => {
      if (!isOpen || !seller) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/revenue/seller/${seller._id}`
        );
        setRevenueData(
          response.data.data || {
            overallRevenue: 0,
            monthlyRevenue: {},
            totalOrdersProcessed: 0,
            commissionRate: 0,
          }
        );
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setError(err.message || "Failed to fetch revenue data");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [isOpen, seller]);

  // Compute overall revenue statistics
  const overallStats = useMemo(() => {
    if (!seller || !revenueData.monthlyRevenue) {
      return {
        totalRevenue: 0,
        totalCommission: 0,
        totalEarnings: 0,
        chartData: [],
        averageMonthlyRevenue: 0,
      };
    }

    // Convert monthlyRevenue object to array for chart
    const chartData = Object.entries(revenueData.monthlyRevenue).map(
      ([month, revenue]) => {
        // Convert YYYY-M format to month name and year
        const [year, monthNum] = month.split("-");
        const date = new Date(parseInt(year), parseInt(monthNum) - 1);
        const monthName = date.toLocaleString("default", { month: "short" });

        return {
          name: `${monthName} ${year}`,
          revenue: revenue,
        };
      }
    );

    // Sort chart data chronologically
    chartData.sort((a, b) => {
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
      return dateA - dateB;
    });

    // Calculate average monthly revenue
    const monthCount = Object.keys(revenueData.monthlyRevenue).length;
    const averageMonthlyRevenue =
      monthCount > 0 ? revenueData.overallRevenue / monthCount : 0;

    // Get total commission based on commission rate
    const commissionRate =
      revenueData.commissionRate || seller.commissionRate || 10;
    const totalCommission = (revenueData.overallRevenue * commissionRate) / 100;

    return {
      totalRevenue: revenueData.overallRevenue || 0,
      totalCommission,
      totalEarnings: revenueData.overallRevenue - totalCommission,
      chartData: chartData.reverse(), // Most recent first for chart
      averageMonthlyRevenue,
    };
  }, [revenueData, seller]);

  // Calculate selected month's revenue data
  const selectedMonthData = useMemo(() => {
    if (!selectedMonth || !revenueData.monthlyRevenue) {
      return {
        total: 0,
        commission: 0,
        earnings: 0,
      };
    }

    const monthRevenue = revenueData.monthlyRevenue[selectedMonth] || 0;
    const commissionRate =
      revenueData.commissionRate || seller?.commissionRate || 10;
    const commission = (monthRevenue * commissionRate) / 100;

    return {
      total: monthRevenue,
      commission,
      earnings: monthRevenue - commission,
    };
  }, [selectedMonth, revenueData, seller]);

  // Early return if not open or no seller
  if (!isOpen || !seller) return null;

  // Generate last 6 months for dropdown options
  const monthOptions = (() => {
    const options = [];
    const currentDate = new Date();

    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      const value = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const label = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      options.push({ value, label });
    }

    return options;
  })();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[750px] md:w-[850px]">
        <SheetHeader className="mb-4">
          <SheetTitle>Revenue Details</SheetTitle>
          <SheetDescription>
            Revenue and commission breakdown for {seller.shopName}
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">
                Select Month
              </label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-[calc(100vh-180px)] pr-4">
              <div className="space-y-6">
                {/* Overall Revenue Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Overall Revenue</CardTitle>
                    <CardDescription>
                      Total earnings until today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 grid-cols-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Total Revenue
                        </p>
                        <p className="text-md font-bold text-nowrap">
                          ₹{overallStats.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Total Earnings
                        </p>
                        <p className="text-md font-bold text-nowrap">
                          ₹{overallStats.totalEarnings.toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Avg. Monthly
                        </p>
                        <p className="text-md font-bold text-nowrap">
                          ₹{overallStats.averageMonthlyRevenue.toFixed(0)}
                        </p>
                      </div>
                    </div>

                    <div className="h-[180px] mt-8">
                      {overallStats.chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={overallStats.chartData}
                            margin={{ top: 5, right: 20, bottom: 25, left: 0 }}
                          >
                            <XAxis
                              dataKey="name"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                              dy={10}
                            />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-background border rounded p-2 shadow-sm">
                                      <div className="text-xs text-muted-foreground">
                                        {payload[0].payload.name}
                                      </div>
                                      <div className="font-medium">
                                        ₹{payload[0].value.toLocaleString()}
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="revenue"
                              strokeWidth={2}
                              activeDot={{ r: 6 }}
                              stroke="#0284c7"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">
                            No revenue data available
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Revenue Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Monthly Revenue</CardTitle>
                    <CardDescription>
                      For{" "}
                      {monthOptions.find((m) => m.value === selectedMonth)
                        ?.label || ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Total Revenue:
                        </span>
                        <span className="font-medium text-lg">
                          ₹{selectedMonthData.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Admin Commission (
                          {revenueData.commissionRate ||
                            seller.commissionRate ||
                            10}
                          %):
                        </span>
                        <span className="font-medium text-lg">
                          ₹{selectedMonthData.commission.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-3 mt-2">
                        <span className="text-muted-foreground font-medium">
                          Seller Earnings:
                        </span>
                        <span className="font-bold text-lg">
                          ₹{selectedMonthData.earnings.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction History Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Orders Processed</CardTitle>
                    <CardDescription>
                      Total orders: {revenueData.totalOrdersProcessed || 0}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {revenueData.totalOrdersProcessed > 0 ? (
                      <p className="text-muted-foreground">
                        You have successfully delivered{" "}
                        {revenueData.totalOrdersProcessed} orders.
                      </p>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No completed orders to display for this period.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default RevenueDetailsSheet;
