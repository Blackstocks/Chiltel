import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const { pathname } = location;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar when path changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      if (isMobileOpen && sidebar && !sidebar.contains(event.target)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

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
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-20 bg-white p-2 rounded-lg border shadow-sm"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 flex flex-col h-screen bg-white border-r transition-all duration-300",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Desktop Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:block absolute -right-3 top-6 bg-white border rounded-full p-1.5 hover:bg-slate-50"
        >
          {isCollapsed ? 
            <ChevronRight className="h-4 w-4 text-slate-600" /> : 
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          }
        </button>

        {/* Logo/Brand */}
        <div className={cn(
          "flex items-center px-3 py-4 mt-2",
          isCollapsed ? "lg:justify-center" : ""
        )}>
          {isCollapsed ? (
            <Store className="hidden lg:block h-6 w-6" />
          ) : (
            <span className="text-xl font-bold ml-4">Seller Panel</span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 py-4 px-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isCollapsed ? "lg:justify-center" : "space-x-3",
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <IconComponent className="h-5 w-5 flex-shrink-0" />
                <span className={cn(
                  "transition-opacity duration-200",
                  isCollapsed && "lg:hidden"
                )}>{item.title}</span>
                {!isCollapsed && item.badge && (
                  <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Seller Info */}
        <div className="border-t pt-4 px-3">
          <div className={cn(
            "py-2 mb-2",
            isCollapsed ? "lg:text-center" : ""
          )}>
            <div className={cn(
              "flex items-center",
              isCollapsed ? "lg:justify-center" : "space-x-3"
            )}>
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Store className="h-4 w-4 text-slate-500" />
              </div>
              <div className={cn(
                "flex flex-col",
                isCollapsed && "lg:hidden"
              )}>
                <span className="text-sm font-medium">{user.shopName}</span>
                <span className="text-xs text-slate-500">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50",
              isCollapsed && "lg:justify-center"
            )}
            onClick={() => {
              logout();
              setIsMobileOpen(false);
            }}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5" />
            <span className={cn(
              "ml-2",
              isCollapsed && "lg:hidden"
            )}>Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;