import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useEffect, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import {
  CheckCircle2,
  Clock,
  Navigation,
  Phone,
  Plus,
  Package,
  IndianRupee,
  CalendarDays,
  Info,
  NotepadText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import ActiveService from "./ActiveService";
import Loader from "./Loader";

const OverviewTab = () => {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <div>Error loading your profile</div>;
  }

  // Calculate current month's earnings
  const currentMonthEarnings = profile.earning
    .filter(
      (e) =>
        new Date(e.date).getMonth() === new Date().getMonth() &&
        new Date(e.date).getFullYear() === new Date().getFullYear()
    )
    .reduce((total, e) => total + e.amount, 0);

  // Calculate last month's earnings
  const lastMonthEarnings = profile.earning
    .filter(
      (e) =>
        new Date(e.date).getMonth() === new Date().getMonth() - 1 &&
        new Date(e.date).getFullYear() === new Date().getFullYear()
    )
    .reduce((total, e) => total + e.amount, 0);

  // Calculate percentage change
  const percentageChange = lastMonthEarnings
    ? ((currentMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100
    : 0;

  return (
    <div className="space-y-8">
      {/* Earnings Section */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">
                Earnings Overview
              </CardTitle>
              <CardDescription className="mt-1 text-gray-600">
                Track your financial performance
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="items-center hidden gap-2 bg-white sm:flex hover:bg-indigo-50"
            >
              <TrendingUp className="w-4 h-4" />
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Earnings Card */}
            <div className="relative p-6 overflow-hidden transition-all duration-200 bg-white border border-green-100 shadow-sm rounded-xl hover:shadow-md group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Total Earnings
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-800">
                      ₹
                      {profile.earning.reduce(
                        (total, e) => total + e.amount,
                        0
                      ) || 0}
                    </span>
                  </div>
                </div>
                <div className="p-3 transition-colors duration-200 bg-green-100 rounded-full group-hover:bg-green-200">
                  <Wallet className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">Lifetime earnings</span>
                </div>
              </div>
              <div className="absolute w-24 h-24 transition-opacity duration-200 rounded-full -right-6 -top-6 bg-green-50 opacity-20 group-hover:opacity-30"></div>
            </div>

            {/* Monthly Earnings Card */}
            <div className="relative p-6 overflow-hidden transition-all duration-200 bg-white border border-blue-100 shadow-sm rounded-xl hover:shadow-md group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Monthly Earnings
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-800">
                      ₹{currentMonthEarnings}
                    </span>
                  </div>
                </div>
                <div className="p-3 transition-colors duration-200 bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div
                  className={`flex items-center gap-1 ${
                    percentageChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {percentageChange >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(percentageChange).toFixed(1)}% vs last month
                  </span>
                </div>
              </div>
              <div className="absolute w-24 h-24 transition-opacity duration-200 rounded-full -right-6 -top-6 bg-blue-50 opacity-20 group-hover:opacity-30"></div>
            </div>

            {/* Today's Earnings Card */}
            <div className="relative p-6 overflow-hidden transition-all duration-200 bg-white border border-purple-100 shadow-sm rounded-xl hover:shadow-md group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Today's Earnings
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-800">
                      ₹
                      {profile.earning
                        .filter(
                          (e) =>
                            new Date(e.date).toDateString() ===
                            new Date().toDateString()
                        )
                        .reduce((total, e) => total + e.amount, 0)}
                    </span>
                  </div>
                </div>
                <div className="p-3 transition-colors duration-200 bg-purple-100 rounded-full group-hover:bg-purple-200">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-1 text-purple-600">
                  <span className="text-sm font-medium">Updated live</span>
                </div>
              </div>
              <div className="absolute w-24 h-24 transition-opacity duration-200 rounded-full -right-6 -top-6 bg-purple-50 opacity-20 group-hover:opacity-30"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Coins Card */}
        {profile?.balance > 0 && (
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                Coins Balance
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 p-0 rounded-full hover:bg-gray-100"
                      >
                        <Info className="w-4 h-4 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-4 space-y-2 bg-gray-900">
                      <div className="space-y-3">
                        <div>
                          <h4 className="mb-1 text-sm font-semibold text-white">
                            Coin System
                          </h4>
                          <div className="space-y-1 text-xs text-gray-300">
                            <p className="flex items-center gap-2">
                              <span className="text-yellow-400">🪙</span>
                              ₹2000 = 200 coins initial balance
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-yellow-400">🪙</span>5 coins
                              deducted per service
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-1 text-sm font-semibold text-white">
                            How it works
                          </h4>
                          <ul className="pl-4 space-y-1 text-xs text-gray-300 list-disc">
                            <li>
                              Coins are automatically deducted when a service is
                              completed
                            </li>
                            <li>
                              You can recharge coins through the wallet section
                            </li>
                            <li>Minimum balance required: 5 coins</li>
                          </ul>
                        </div>

                        <div className="pt-1 text-xs text-gray-400 border-t border-gray-700">
                          Contact support for more information about the coin
                          system
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-2xl font-bold">
                  🪙 {profile.balance / 10 || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  Available for services
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services Overview Card */}
        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Services Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {profile.services.total}
                </div>
                <p className="text-sm text-muted-foreground">Total Services</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-yellow-50">
                  <div className="text-xl font-semibold text-yellow-600">
                    {profile.services.total - profile.services.completed}
                  </div>
                  <p className="text-sm text-yellow-600">Pending</p>
                </div>

                <div className="p-3 rounded-lg bg-green-50">
                  <div className="text-xl font-semibold text-green-600">
                    {profile.services.completed}
                  </div>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Card */}
        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Performance Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.rating.count > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                  {profile.rating.average}
                  <span className="text-yellow-400">★</span>
                </div>
                <p className="text-sm text-gray-500">
                  Based on {profile.rating.count}{" "}
                  {profile.rating.count > 1 ? "ratings" : "rating"}
                </p>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm text-gray-500">No reviews yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Service Section */}
      {<ActiveService />}
      <Separator className="my-8" />
      <CurrCard />
    </div>
  );
};

// CurrCard component remains the same
const CurrCard = () => {
  const {
    getAcceptedServices,
    loading,
    error,
    addExtraWorks,
    startService,
    startWorking,
  } = useServices();
  const [currServices, setCurrServices] = useState(null);

  useEffect(() => {
    getAcceptedServices().then((service) => {
      setCurrServices(service);
    });
  }, []);

  if (loading) {
    return (
      <div className="mt-4 text-center text-gray-500">Loading services...</div>
    );
  }

  const handleStartService = async (serviceId) => {
    try {
      await startService(serviceId);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

	// Function to open navigation
	const handleNavigate = (currService) => {
		console.log(currService);
		if (currService?.userLocation?.address) {
			window.open(
				`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
					currService.userLocation.address
				)}`,
				"_blank"
			);
		}
	};
	return (
		<>
			{<ActiveService />}
			<Separator className="md:col-span-2 lg:col-span-3" />
			<Card className="md:col-span-2 lg:col-span-3">
				<CardHeader>
					<CardTitle>Accepted Services</CardTitle>
					<CardDescription>Active service details</CardDescription>
				</CardHeader>
				{!currServices && error ? (
					<CardDescription className="m-2 text-center">{error}</CardDescription>
				) : (
					currServices &&
					currServices?.map((currService, index) => (
						<CardContent className="space-y-6" key={currService._id}>
							<CardTitle>Service #{index + 1}</CardTitle>
							{/* Customer Details */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<MapPin className="w-4 h-4 text-muted-foreground" />
										<span>{currService?.userLocation?.address}</span>
									</div>
									<Button
										variant="outline"
										onClick={() => handleNavigate(currService)}
										className="flex items-center space-x-2"
									>
										<Navigation className="w-4 h-4" />
										<span>Navigate</span>
									</Button>
								</div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <Clock className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Duration
                    </p>
                    <p className="text-sm text-gray-600">
                      {currService?.service.estimatedDuration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <Package className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Service Type
                    </p>
                    <p className="text-sm text-gray-600">
                      {currService?.service.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <IndianRupee className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Price</p>
                    <p className="text-sm text-gray-600">
                      ₹{currService?.price}
                    </p>
                  </div>
                </div>

                {currService?.remarks && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-200 rounded-full">
                      <NotepadText className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Additional Notes
                      </p>
                      <p className="text-sm text-gray-600">
                        {currService?.remarks}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => handleStartService(currService._id)}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200 min-w-[150px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Start Service
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          ))
        )}
      </Card>
    </>
  );
};

export default OverviewTab;
