import { Link } from "react-router-dom";
import { specialties } from "@/lib/data";
import { Stethoscope, Baby, Brain, Heart, Smile, Activity } from "lucide-react";

const specialtyIcons: Record<string, React.ReactNode> = {
  "General physician": <Stethoscope className="h-8 w-8" />,
  "Gynecologist": <Heart className="h-8 w-8" />,
  "Dermatologist": <Smile className="h-8 w-8" />,
  "Pediatricians": <Baby className="h-8 w-8" />,
  "Neurologist": <Brain className="h-8 w-8" />,
  "Gastroenterologist": <Activity className="h-8 w-8" />,
};

export function Specialties() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Find by Speciality</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {specialties.map((specialty) => (
            <Link
              key={specialty}
              to={`/doctors?specialty=${encodeURIComponent(specialty)}`}
              className="group flex flex-col items-center gap-3 rounded-lg p-4 transition-all hover:-translate-y-1 hover:bg-secondary"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {specialtyIcons[specialty]}
              </div>
              <span className="text-center text-sm font-medium text-foreground">{specialty}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
