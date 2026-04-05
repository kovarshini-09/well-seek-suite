import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/app-context";
import { CalendarDays, CheckCircle, XCircle, IndianRupee, LogOut, Stethoscope } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { userRole, loggedInDoctor, user, logout, appointments, getDoctorEarnings, getDoctorAppointments, updateAppointmentStatus } = useApp();

  useEffect(() => {
    if (userRole !== "doctor" || !loggedInDoctor) navigate("/staff-login");
  }, [userRole, loggedInDoctor, navigate]);

  if (!loggedInDoctor || !user) return null;

  const doctorAppointments = getDoctorAppointments(loggedInDoctor.id);
  const totalAppointments = doctorAppointments.length;
  const approved = doctorAppointments.filter((a) => a.status === "upcoming" || a.status === "completed").length;
  const cancelled = doctorAppointments.filter((a) => a.status === "cancelled").length;
  const earnings = getDoctorEarnings(loggedInDoctor.id);

  const handleStatusChange = (aptId: string, status: string) => {
    updateAppointmentStatus(aptId, status as "pending" | "completed" | "cancelled");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground">{loggedInDoctor.name}</h1>
              <p className="text-sm text-muted-foreground">{loggedInDoctor.specialty} • {loggedInDoctor.degree}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><CalendarDays className="h-6 w-6 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">Appointments</p><p className="text-2xl font-bold text-foreground">{totalAppointments}</p></div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10"><CheckCircle className="h-6 w-6 text-success" /></div>
              <div><p className="text-sm text-muted-foreground">Approved</p><p className="text-2xl font-bold text-foreground">{approved}</p></div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10"><XCircle className="h-6 w-6 text-destructive" /></div>
              <div><p className="text-sm text-muted-foreground">Cancelled</p><p className="text-2xl font-bold text-foreground">{cancelled}</p></div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10"><IndianRupee className="h-6 w-6 text-warning" /></div>
              <div><p className="text-sm text-muted-foreground">Earnings</p><p className="text-2xl font-bold text-foreground">₹{earnings}</p></div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-foreground">Patient Appointments</h2>
          {doctorAppointments.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No appointments booked yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {doctorAppointments.map((apt) => (
                <div key={apt.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {(apt.patientName || "P").charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{apt.patientName || "Patient"}</h3>
                      <p className="text-sm text-muted-foreground">{apt.patientEmail}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{new Date(apt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <p>{apt.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">₹{apt.doctor.fees}</p>
                  </div>
                  <Select value={apt.status} onValueChange={(v) => handleStatusChange(apt.id, v)}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
