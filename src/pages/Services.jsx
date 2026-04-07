import { Link } from "react-router-dom";
import { useApp } from "@/context/app-context";
import { Clock, IndianRupee, ArrowRight, CheckCircle } from "lucide-react";

export default function ServicesPage() {
  const { allServices } = useApp();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Our <span className="text-primary">Services</span></h1>
        <p className="mt-2 text-muted-foreground">Book diagnostic tests and health checkups easily</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {allServices.map((service) => (
          <div key={service.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg sm:flex-row">
            <div className="relative h-56 shrink-0 overflow-hidden sm:h-auto sm:w-56">
              <img src={service.image} alt={service.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {service.available && (
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-success px-2 py-1 text-xs font-medium text-success-foreground">
                  <CheckCircle className="h-3 w-3" /> Available
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">{service.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-primary" />{service.duration}</div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><IndianRupee className="h-4 w-4 text-primary" />₹{service.price}</div>
                </div>
              </div>
              <Link to={`/services/${service.id}`} className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90">
                Book Service <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
