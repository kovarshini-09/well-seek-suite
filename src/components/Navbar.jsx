import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const location = useLocation();
  const { isLoggedIn, user, userRole, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = location.pathname;

  // Don't show navbar on admin/doctor dashboards
  if (pathname.startsWith("/admin-dashboard") || pathname.startsWith("/doctor-dashboard")) {
    return null;
  }

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/doctors", label: "ALL DOCTORS" },
    { href: "/services", label: "SERVICES" },
    { href: "/about", label: "ABOUT" },
    { href: "/contact", label: "CONTACT" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <svg className="h-8 w-8 text-primary" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="currentColor" />
            <path d="M10 16h12M16 10v12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-xl font-bold text-foreground">Prescripto</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="mt-1 block h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn && userRole === "patient" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-appointments">My Appointments</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !isLoggedIn ? (
            <>
              <Button asChild className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                <Link to="/login">Create account</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8">
                <Link to="/staff-login">Login</Link>
              </Button>
            </>
          ) : null}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 text-sm font-medium ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && userRole === "patient" ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="py-3 text-sm font-medium text-muted-foreground">My Profile</Link>
                <Link to="/my-appointments" onClick={() => setMobileMenuOpen(false)} className="py-3 text-sm font-medium text-muted-foreground">My Appointments</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="py-3 text-left text-sm font-medium text-destructive">Logout</button>
              </>
            ) : !isLoggedIn ? (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mt-2 py-3 text-sm font-medium text-primary">Create account</Link>
                <Link to="/staff-login" onClick={() => setMobileMenuOpen(false)} className="py-3 text-sm font-medium text-muted-foreground">Staff Login</Link>
              </>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}
