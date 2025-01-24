import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Wrench,
  ShoppingCart,
  Users,
  ChevronRight,
  LogOut,
} from "lucide-react";

const Sidebar = ({ userRole, handleLogout }) => {
  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
      role: ["super-admin", "sub-admin"],
    },
    {
      title: "Products",
      icon: <Package className="h-5 w-5" />,
      href: "/products",
      role: ["super-admin", "sub-admin"],
    },
    {
      title: "Services",
      icon: <Wrench className="h-5 w-5" />,
      href: "/services",
      role: ["super-admin", "sub-admin"],
    },
    {
      title: "Orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/orders",
      role: ["super-admin", "sub-admin"],
    },
    {
      title: "Service Partners",
      icon: <Users className="h-5 w-5" />,
      href: "/riders",
      role: ["super-admin"],
    },
    {
      title: "Sellers",
      icon: <Users className="h-5 w-5" />,
      href: "/sellers",
      role: ["super-admin"],
    },
    {
      title: "Support Tickets",
      icon: <Users className="h-5 w-5" />,
      href: "/supportTickets",
      role: ["super-admin", "sub-admin"],
    },
    {
      title: "Sub-Admins",
      icon: <Users className="h-5 w-5" />,
      href: "/sub-admins",
      role: ["super-admin"],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.role.includes(userRole)
  );

  return (
    <div className="h-screen w-64 border-r bg-background flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="flex items-center px-3 py-4">
              <span className="text-xl font-bold">Chiltel Admin</span>
            </div>
            <div className="space-y-1">
              {filteredNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t space-y-2">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              "flex items-center w-full rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )
          }
        >
          <Users className="h-5 w-5 mr-2" />
          Profile
        </NavLink>
        <Button
          variant="ghost"
          className="w-full justify-start px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
