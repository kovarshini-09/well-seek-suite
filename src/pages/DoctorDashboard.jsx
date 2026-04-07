import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/app-context";
import { CalendarDays, CheckCircle, XCircle, IndianRupee, LogOut, Stethoscope, User, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statusColors = {
  upcoming: "bg-blue-100 text-blue-700 border-blue-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { userRole, loggedInDoctor, user, logout, appointments, getDoctorEarnings, getDoctorAppointments, updateAppointmentStatus, updateDoctor } = useApp();
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    if (userRole !== "doctor" || !loggedInDoctor) navigate("/staff-login");
  }, [userRole, loggedInDoctor, navigate]);

  if (!loggedInDoctor || !user) return null;

  const doctorAppointments = getDoctorAppointments(loggedInDoctor.id);
  const totalAppointments = doctorAppointments.length;
  const approved = doctorAppointments.filter((a) => a.status === "upcoming" || a.status === "completed").length;
  const cancelled = doctorAppointments.filter((a) => a.status === "cancelled").length;
  const earnings = getDoctorEarnings(loggedInDoctor.id);

  const handleStatusChange = (aptId, status) => {
    updateAppointmentStatus(aptId, status);
  };

  const tabs = [
    { key: "appointments", label: "Appointments", icon: <CalendarDays className="h-4 w-4" /> },
    { key: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
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
        <div className="border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards - always visible */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><CalendarDays className="h-6 w-6 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">Appointments</p><p className="text-2xl font-bold text-foreground">{totalAppointments}</p></div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100"><CheckCircle className="h-6 w-6 text-green-600" /></div>
              <div><p className="text-sm text-muted-foreground">Approved</p><p className="text-2xl font-bold text-foreground">{approved}</p></div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100"><XCircle className="h-6 w-6 text-red-600" /></div>
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

        {activeTab === "appointments" && (
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
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[apt.status] || ""}`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <DoctorProfile doctor={loggedInDoctor} onUpdate={updateDoctor} />
        )}
      </div>
    </div>
  );
}

function DoctorProfile({ doctor, onUpdate }) {
  const [form, setForm] = useState({
    name: doctor.name || "",
    email: doctor.email || "",
    phone: doctor.phone || "",
    specialty: doctor.specialty || "",
    degree: doctor.degree || "",
    experience: doctor.experience || "",
    fees: String(doctor.fees || ""),
    about: doctor.about || "",
    addressLine1: doctor.address?.line1 || "",
    addressLine2: doctor.address?.line2 || "",
    age: String(doctor.age || ""),
    gender: doctor.gender || "",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate(doctor.id, {
      name: form.name,
      email: form.email,
      phone: form.phone,
      specialty: form.specialty,
      degree: form.degree,
      experience: form.experience,
      fees: Number(form.fees) || doctor.fees,
      about: form.about,
      address: { line1: form.addressLine1, line2: form.addressLine2 },
      age: Number(form.age) || doctor.age,
      gender: form.gender,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mt-8 mx-auto max-w-2xl">
      <h2 className="mb-6 text-xl font-bold text-foreground">My Profile</h2>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-4 mb-4">
          <img src={doctor.image} alt={doctor.name} className="h-20 w-20 rounded-full object-cover border-2 border-primary" />
          <div>
            <h3 className="text-lg font-bold text-foreground">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialty} • {doctor.degree}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><Label>Specialty</Label><Input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} /></div>
          <div><Label>Degree</Label><Input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} /></div>
          <div><Label>Experience</Label><Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} /></div>
          <div><Label>Fees (₹)</Label><Input type="number" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} /></div>
          <div><Label>Age</Label><Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
          <div><Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div><Label>Address Line 1</Label><Input value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} /></div>
        <div><Label>Address Line 2</Label><Input value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} /></div>
        <div><Label>About</Label><Input value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} /></div>

        <Button onClick={handleSave} className="w-full rounded-full">
          <Save className="mr-2 h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
