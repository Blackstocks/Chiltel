import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Package, 
  Wrench, 
  ShoppingCart, 
  Users,
  ChevronRight
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard"
    },
    {
      title: "Products",
      icon: <Package className="h-5 w-5" />,
      href: "/products"
    },
    {
      title: "Services",
      icon: <Wrench className="h-5 w-5" />,
      href: "/services"
    },
    {
      title: "Orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/orders"
    },
    {
      title: "Riders",
      icon: <Users className="h-5 w-5" />,
      href: "/riders"
    }
  ];

  return (
    <div className="relative min-h-screen w-64 border-r bg-background">
      <ScrollArea className="h-full w-full">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">
              Admin Portal
            </h2>
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) => cn(
                    "flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
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
    </div>
  );
};

export default Sidebar;