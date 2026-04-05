import { Link } from "react-router-dom";
import type { Doctor } from "@/lib/data";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link
      to={`/doctors/${doctor.id}`}
      className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-48 overflow-hidden bg-secondary">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              doctor.available ? "bg-success" : "bg-muted-foreground"
            }`}
          />
          <span
            className={`text-xs ${
              doctor.available ? "text-success" : "text-muted-foreground"
            }`}
          >
            {doctor.available ? "Available" : "Not Available"}
          </span>
        </div>
        <h3 className="font-semibold text-foreground">{doctor.name}</h3>
        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
      </div>
    </Link>
  );
}
