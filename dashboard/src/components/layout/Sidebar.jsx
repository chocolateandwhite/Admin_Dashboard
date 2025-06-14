import { Link, useLocation } from "react-router-dom";
import { Home, Settings, Users, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const location = useLocation();
  const links = [
    { to: "/", icon: <Home className="w-4 h-4" />, label: "Dashboard" },
    { to: "/users", icon: <Users className="w-4 h-4" />, label: "Users" },
    { to: "/settings", icon: <Settings className="w-4 h-4" />, label: "Settings" },
  ];

  return (
    <aside className={`bg-white dark:bg-gray-900 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} p-4`}>
      <div className="flex justify-between items-center mb-6">
        {!isCollapsed && <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin</h1>}
        <button onClick={toggleSidebar}>
          {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
        </button>
      </div>
      <nav className="space-y-2">
        {links.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${location.pathname === to ? "bg-gray-200 dark:bg-gray-800" : ""}`}
          >
            {icon} {!isCollapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
