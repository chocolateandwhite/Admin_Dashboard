import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronDown,
  ChevronUp,
  Menu,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isCouponsOpen, setIsCouponsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Products",
      icon: <Package className="w-5 h-5" />,
      children: [
        { name: "All Products", href: "/products" },
        { name: "Add Product", href: "/products/add" },
        { name: "Categories", href: "/products/categories" },
      ],
    },
    {
      name: "Coupons",
      icon: <Percent className="w-5 h-5" />,
      children: [
        { name: "All Coupons", href: "/coupons" },
        { name: "Create Coupon", href: "/coupons/create" },
        { name: "Coupon Settings", href: "/coupons/settings" },
      ],
    },
    {
      name: "Orders",
      href: "/orders",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      name: "Customers",
      href: "/customers",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-muted/50">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r transition-all duration-300 ease-in-out z-40 flex flex-col",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-between p-4 border-b">
          <span className={cn("text-lg font-bold transition-opacity", !isSidebarOpen && "opacity-0")}>
            Chocolate and White
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-auto"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.name}>
                <button
                  onClick={() => {
                    if (item.name === "Products") {
                      setIsProductsOpen(!isProductsOpen);
                    } else if (item.name === "Coupons") {
                      setIsCouponsOpen(!isCouponsOpen);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100",
                    location.pathname.startsWith(
                      item.name === "Products" ? "/products" : "/coupons"
                    )
                      ? "bg-gray-200"
                      : "text-gray-700"
                  )}
                >
                  {item.icon}
                  {isSidebarOpen && <span className="ml-3">{item.name}</span>}
                  {isSidebarOpen && (
                    <span className="ml-auto">
                      {(item.name === "Products" && isProductsOpen) ||
                      (item.name === "Coupons" && isCouponsOpen) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </button>
                {(item.name === "Products" ? isProductsOpen : isCouponsOpen) &&
                  isSidebarOpen && (
                    <div className="ml-10 mt-1 flex flex-col space-y-1">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          className={cn(
                            "text-sm px-2 py-1 rounded hover:bg-gray-100",
                            location.pathname === sub.href
                              ? "bg-gray-200 font-medium"
                              : "text-gray-600"
                          )}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.href!}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors",
                  location.pathname === item.href ? "bg-gray-200" : "text-gray-700"
                )}
              >
                {item.icon}
                {isSidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          )}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 w-full">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
