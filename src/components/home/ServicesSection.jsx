import { Link } from "react-router-dom";
import { useApp } from "@/context/app-context";
import { ArrowRight, Clock, IndianRupee } from "lucide-react";

export function ServicesSection() {
  const { allServices } = useApp();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Book diagnostic tests and health checkups with ease.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {allServices.map((service, index) => (
            <Link
              key={service.id}
              to={`/services/${service.id}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={service.image} alt={service.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {service.price}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">{service.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Book Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/services" className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
            View All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
