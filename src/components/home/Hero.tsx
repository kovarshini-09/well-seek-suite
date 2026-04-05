import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 py-12 md:grid-cols-2 md:py-0">
          <div className="space-y-6 text-primary-foreground md:py-16">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Book Appointment With Trusted Doctors
            </h1>
            <div className="flex items-start gap-3">
              <div className="flex -space-x-2">
                <div className="h-10 w-10 rounded-full border-2 border-primary-foreground bg-secondary" />
                <div className="h-10 w-10 rounded-full border-2 border-primary-foreground bg-secondary" />
                <div className="h-10 w-10 rounded-full border-2 border-primary-foreground bg-secondary" />
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                Simply browse through our extensive list of trusted doctors,
                <br className="hidden sm:block" />
                schedule your appointment hassle-free.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90">
                <Link to="/doctors" className="flex items-center gap-2">
                  Book appointment <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden h-full md:flex md:items-end md:justify-center">
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=400&fit=crop" alt="Group of doctors" className="h-80 object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
