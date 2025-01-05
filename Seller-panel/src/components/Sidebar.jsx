import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Bell,
  LogOut,
  Users,
  Store,
  HelpCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard"
    },
    {
      title: "Products",
      icon: Package,
      href: "/products"
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      href: "/orders"
    },
    {
      title: "Store Settings",
      icon: Store,
      href: "/store"
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      href: "/support"
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-white border-r w-64 px-3 py-4">
      {/* Logo/Brand */}
      <div className="flex items-center px-3 py-4">
        <span className="text-xl font-bold">Seller Panel</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 py-4">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <IconComponent className="h-5 w-5" />
              <span>{item.title}</span>
              {item.badge && (
                <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Seller Info */}
      <div className="border-t pt-4">
        <div className="px-3 py-2 mb-2">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Store className="h-4 w-4 text-slate-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Store Name</span>
              <span className="text-xs text-slate-500">seller@example.com</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          className="w-full justify-start px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => {
            // Handle logout
            console.log("Logout clicked");
          }}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;