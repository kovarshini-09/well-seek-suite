import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="currentColor" />
                <path d="M10 16h12M16 10v12" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-xl font-bold text-foreground">Prescripto</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your trusted partner in managing your healthcare needs conveniently and efficiently.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About us</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground">+91 44 2817 0000</li>
              <li className="text-sm text-muted-foreground">contact@prescripto.in</li>
              <li className="text-sm text-muted-foreground">No. 57, Anna Salai, Guindy</li>
              <li className="text-sm text-muted-foreground">Chennai, Tamil Nadu 600032, India</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">Copyright 2024 @ Prescripto - All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
