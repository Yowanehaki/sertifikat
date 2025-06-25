import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Upload } from "lucide-react";
import logo from "../../assets/logo.png";

const navItems = [
  { title: "Single Certificate", href: "/", icon: <Home className="inline mr-2" size={18} /> },
  { title: "Bulk Upload", href: "/bulk", icon: <Upload className="inline mr-2" size={18} /> },
];

export default function NavigationMenu() {
  const location = useLocation();
  return (
    <nav className="w-full flex justify-center py-4 sticky top-0 z-50 bg-transparent">
      <div className="w-full max-w-7xl flex items-center justify-between bg-white rounded-2xl border border-gray-200 px-6 py-2">
        {/* Logo kiri */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded-full" />
        </Link>
        {/* Menu tengah */}
        <ul className="hidden md:flex flex-1 justify-center gap-8">
          {navItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.href}
                className={`text-lg font-medium px-2 py-1 rounded transition-colors select-none flex items-center gap-1 ${location.pathname === item.href ? "text-black" : "text-gray-700 hover:text-black"}`}
              >
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        {/* Kanan kosong */}
        <div className="w-10 h-10" />
      </div>
    </nav>
  );
}

function MobileMenu({ location }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        className="p-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-gray-100 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-4 top-16 w-48 bg-white border rounded-lg shadow-lg py-2 animate-fade-in-down">
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded-md font-medium transition-colors text-sm
                ${location.pathname === item.href
                  ? "bg-blue-100 text-blue-700 shadow"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"}
              `}
              title={item.description}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </>
  );
} 