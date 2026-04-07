import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, IndianRupee, CheckCircle, XCircle } from "lucide-react";

export default function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allDoctors, isLoggedIn, bookAppointment } = useApp();
  const doctor = allDoctors.find((d) => d.id === id);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [booked, setBooked] = useState(false);

  if (!doctor) return <div className="py-20 text-center text-muted-foreground">Doctor not found</div>;

  const timeSlots = ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"];

  const getNextDays = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({ date: d.toISOString().split("T")[0], label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) });
    }
    return days;
  };

  const handleBook = () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (!selectedDate || !selectedTime) return;
    bookAppointment(doctor, selectedDate, selectedTime);
    setBooked(true);
    setTimeout(() => navigate("/my-appointments"), 1500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="shrink-0">
          <img src={doctor.image} alt={doctor.name} className="h-72 w-72 rounded-xl object-cover bg-secondary" />
        </div>
        <div className="flex-1 rounded-xl border border-border bg-card p-6">
          <h1 className="text-2xl font-bold text-foreground">{doctor.name} <CheckCircle className="inline h-5 w-5 text-primary" /></h1>
          <p className="mt-1 text-muted-foreground">{doctor.degree} - {doctor.specialty}</p>
          <span className="mt-2 inline-block rounded-full border border-border px-3 py-1 text-xs">{doctor.experience}</span>

          {/* Availability Badge */}
          <div className="mt-3 flex items-center gap-2">
            {doctor.available ? (
              <>
                <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-600">Available for appointments</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-500">Currently unavailable</span>
              </>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-foreground">About</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{doctor.about}</p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {doctor.address.line1}, {doctor.address.line2}
          </div>
          <p className="mt-4 flex items-center text-foreground">
            Appointment fee: <IndianRupee className="ml-2 h-4 w-4" /><span className="font-bold">{doctor.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking */}
      {doctor.available ? (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Booking slots</h2>
          <div className="flex flex-wrap gap-3">
            {getNextDays().map((d) => (
              <button key={d.date} onClick={() => setSelectedDate(d.date)} className={`rounded-full border px-4 py-2 text-sm transition-colors ${selectedDate === d.date ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>
                {d.label}
              </button>
            ))}
          </div>
          {selectedDate && (
            <div className="mt-4 flex flex-wrap gap-3">
              {timeSlots.map((t) => (
                <button key={t} onClick={() => setSelectedTime(t)} className={`rounded-full border px-4 py-2 text-sm transition-colors ${selectedTime === t ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>
                  <Clock className="mr-1 inline h-3 w-3" />{t}
                </button>
              ))}
            </div>
          )}
          <Button onClick={handleBook} disabled={!selectedDate || !selectedTime || booked} className="mt-6 rounded-full px-12">
            {booked ? "Booked! Redirecting..." : "Book an appointment"}
          </Button>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-lg font-semibold text-red-700">Doctor Currently Unavailable</h3>
          <p className="mt-2 text-sm text-red-600">This doctor is not accepting appointments at the moment. Please check back later or browse other available doctors.</p>
          <Button variant="outline" onClick={() => navigate("/doctors")} className="mt-4 rounded-full">Browse Other Doctors</Button>
        </div>
      )}
    </div>
  );
}
