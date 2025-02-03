import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Settings, Menu, Bell, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import ProfileTab from "@/components/Profile";
import ServicesTab from "@/components/Services";
import OverviewTab from "@/components/Overview";
import HistoryTab from "@/components/History";
import { useAuthActions } from "@/hooks/useAuthActions";
import AttendanceCalendar from "../components/AttendanceCalender";

const RiderDashboard = () => {
  const { logout } = useAuthActions();
  const [activeTab, setActiveTab] = useState("overview");
  const [isOnline, setIsOnline] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Mobile Navigation Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-white">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                  <AvatarFallback className="text-indigo-600 bg-indigo-100">RD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-800">Rider Name</h3>
                  <p className="text-sm text-gray-500">ID: #12345</p>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 border-b border-gray-100">
              <div className="p-4 space-y-4">
                {["Overview", "Services", "History", "Attendance", "Profile"].map((item) => (
                  <Button
                    key={item}
                    variant="ghost"
                    className="justify-start w-full font-normal text-left hover:bg-indigo-50 hover:text-indigo-600"
                    onClick={() => {
                      setActiveTab(item.toLowerCase());
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4">
              <Button
                variant="destructive"
                className="w-full bg-red-500 hover:bg-red-600"
                onClick={logout}
              >
                Log Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-indigo-100 shadow-lg">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-indigo-50"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6 text-indigo-600" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="relative hidden sm:block">
                  <Avatar className="w-12 h-12 ring-2 ring-indigo-200 ring-offset-2">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                    <AvatarFallback className="text-indigo-600 bg-indigo-100">RD</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    <div className={`h-4 w-4 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                      Rider Dashboard
                    </h2>
                    <Badge className="hidden text-indigo-700 bg-indigo-100 border-0 sm:inline-flex">
                      Pro
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 text-sm font-medium ${
                        isOnline 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {isOnline ? "Online" : "Busy"}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={isOnline}
                        onCheckedChange={setIsOnline}
                        className="data-[state=checked]:bg-green-500"
                        aria-label="Online status toggle"
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 p-0 rounded-full hover:bg-indigo-50"
                            >
                              <Info className="w-5 h-5 text-indigo-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="text-white bg-indigo-800">
                            <p>Toggle your availability status</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hidden rounded-full sm:flex hover:bg-indigo-50"
                    >
                      <Bell className="w-5 h-5 text-indigo-500" />
                      <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                        3
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-white bg-indigo-800">
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="destructive"
                className="items-center hidden gap-2 bg-red-500 md:flex hover:bg-red-600"
                onClick={logout}
              >
                Log Out
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-500 md:hidden hover:bg-red-600"
                onClick={logout}
              >
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 mx-auto max-w-7xl lg:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Tabs */}
          <div className="hidden px-2 -mx-2 overflow-x-auto sm:block">
            <TabsList className="w-full min-w-full p-1 mb-6 bg-white rounded-lg shadow-md flex-nowrap">
              <TabsTrigger
                value="overview"
                className="flex-1 whitespace-nowrap text-sm font-medium data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all duration-200"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="flex-1 whitespace-nowrap text-sm font-medium data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all duration-200"
              >
                Services
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex-1 whitespace-nowrap text-sm font-medium data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all duration-200"
              >
                History
              </TabsTrigger>
              <TabsTrigger
                value="attendance"
                className="flex-1 whitespace-nowrap text-sm font-medium data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all duration-200"
              >
                Attendance
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="flex-1 whitespace-nowrap text-sm font-medium data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all duration-200"
              >
                Profile
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Mobile Tab Dropdown */}
          <div className="mb-6 sm:hidden">
            <Button
              variant="outline"
              className="items-center justify-between w-full bg-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="capitalize">{activeTab}</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </div>

          <div className="w-full max-w-full space-y-6 overflow-x-hidden">
            <TabsContent value="overview" className="mt-0 animate-in fade-in-50">
              <Card className="p-6 border-indigo-100 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="min-w-[300px]">
                  <OverviewTab />
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="services" className="mt-0 animate-in fade-in-50">
              <Card className="p-6 border-indigo-100 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="min-w-[300px]">
                  <ServicesTab />
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="mt-0 animate-in fade-in-50">
              <Card className="p-6 border-indigo-100 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="min-w-[300px]">
                  <HistoryTab />
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="attendance" className="mt-0 animate-in fade-in-50">
              <Card className="p-6 border-indigo-100 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="min-w-[300px]">
                  <AttendanceCalendar />
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="profile" className="mt-0 animate-in fade-in-50">
              <Card className="p-6 border-indigo-100 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="min-w-[300px]">
                  <ProfileTab />
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default RiderDashboard;