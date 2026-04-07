import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "@/context/app-context";
import { specialties } from "@/lib/data";
import { DoctorCard } from "@/components/DoctorCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DoctorsPage() {
  const [searchParams] = useSearchParams();
  const specialtyParam = searchParams.get("specialty");
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialtyParam);
  const [showFilters, setShowFilters] = useState(false);
  const { allDoctors } = useApp();

  const filteredDoctors = selectedSpecialty
    ? allDoctors.filter((doc) => doc.specialty === selectedSpecialty)
    : allDoctors;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="mb-6 text-muted-foreground">Browse through the doctors specialist.</p>
      <div className="flex flex-col gap-8 md:flex-row">
        <Button variant="outline" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        <aside className={cn("w-full shrink-0 md:w-52", !showFilters && "hidden md:block")}>
          <div className="flex flex-col gap-2">
            <button onClick={() => setSelectedSpecialty(null)} className={cn("w-full rounded-lg border border-border px-4 py-2 text-left text-sm transition-colors hover:bg-secondary", !selectedSpecialty && "border-primary bg-secondary text-primary")}>
              All Doctors
            </button>
            {specialties.map((s) => (
              <button key={s} onClick={() => setSelectedSpecialty(s)} className={cn("w-full rounded-lg border border-border px-4 py-2 text-left text-sm transition-colors hover:bg-secondary", selectedSpecialty === s && "border-primary bg-secondary text-primary")}>
                {s}
              </button>
            ))}
          </div>
        </aside>
        <div className="flex-1">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
          {filteredDoctors.length === 0 && (
            <div className="py-12 text-center"><p className="text-muted-foreground">No doctors found for this specialty.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
