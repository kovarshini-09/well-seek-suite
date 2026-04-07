import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Clock, IndianRupee } from "lucide-react";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allServices, isLoggedIn, bookService } = useApp();
  const service = allServices.find((s) => s.id === id);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [booked, setBooked] = useState(false);

  if (!service) return <div className="py-20 text-center text-muted-foreground">Service not found</div>;

  const timeSlots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "2:00 PM", "2:30 PM", "3:00 PM"];
  const getNextDays = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      days.push({ date: d.toISOString().split("T")[0], label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) });
    }
    return days;
  };

  const handleBook = () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (!selectedDate || !selectedTime) return;
    bookService(service, selectedDate, selectedTime);
    setBooked(true);
    setTimeout(() => navigate("/my-appointments"), 1500);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative h-64"><img src={service.image} alt={service.name} className="h-full w-full object-cover" /></div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground">{service.name}</h1>
          <p className="mt-2 text-muted-foreground">{service.description}</p>
          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-primary" />{service.duration}</div>
            <div className="flex items-center gap-2 text-lg font-bold text-foreground"><IndianRupee className="h-5 w-5 text-primary" />₹{service.price}</div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Select Date & Time</h2>
        <div className="flex flex-wrap gap-3">
          {getNextDays().map((d) => (
            <button key={d.date} onClick={() => setSelectedDate(d.date)} className={`rounded-full border px-4 py-2 text-sm ${selectedDate === d.date ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>{d.label}</button>
          ))}
        </div>
        {selectedDate && (
          <div className="mt-4 flex flex-wrap gap-3">
            {timeSlots.map((t) => (
              <button key={t} onClick={() => setSelectedTime(t)} className={`rounded-full border px-4 py-2 text-sm ${selectedTime === t ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>{t}</button>
            ))}
          </div>
        )}
        <Button onClick={handleBook} disabled={!selectedDate || !selectedTime || booked} className="mt-6 rounded-full px-12">
          {booked ? "Booked! Redirecting..." : "Book Service"}
        </Button>
      </div>
    </div>
  );
}
