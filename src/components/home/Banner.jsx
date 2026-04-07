import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Banner() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-6 p-8 text-primary-foreground md:p-12">
              <h2 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                Book Appointment<br />With 100+ Trusted Doctors
              </h2>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90">
                  <Link to="/login" className="flex items-center gap-2">
                    Create account <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/staff-login" className="flex items-center gap-2">
                    Login <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden h-64 md:block md:h-80">
              <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=400&fit=crop" alt="Doctor" className="h-full w-full object-contain object-bottom" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
