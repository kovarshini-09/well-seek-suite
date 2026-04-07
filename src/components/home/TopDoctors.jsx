import { Link } from "react-router-dom";
import { useApp } from "@/context/app-context";
import { DoctorCard } from "@/components/DoctorCard";
import { Button } from "@/components/ui/button";

export function TopDoctors() {
  const { allDoctors } = useApp();
  const topDoctors = allDoctors.slice(0, 10);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Top Doctors to Book</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Simply browse through our extensive list of trusted doctors.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {topDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full px-12">
            <Link to="/doctors">more</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
