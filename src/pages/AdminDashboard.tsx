import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/app-context";
import { CalendarDays, CheckCircle, XCircle, LogOut, ShieldCheck, Plus, Trash2, Users, Stethoscope, ClipboardList, TrendingUp, Activity, UserCheck, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { specialties } from "@/lib/data";

type Tab = "home" | "all-doctors" | "add-doctor" | "all-services" | "add-service";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { userRole, user, logout, appointments, allDoctors, addDoctor, removeDoctor, allServices, addService, removeService } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("home");

  useEffect(() => {
    if (userRole !== "admin") navigate("/staff-login");
  }, [userRole, navigate]);

  if (userRole !== "admin") return null;

  const totalAppointments = appointments.length;
  const approved = appointments.filter((a) => a.status === "upcoming" || a.status === "completed").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <ShieldCheck className="h-4 w-4" /> },
    { key: "all-doctors", label: "All Doctors", icon: <Users className="h-4 w-4" /> },
    { key: "add-doctor", label: "Add Doctor", icon: <Stethoscope className="h-4 w-4" /> },
    { key: "all-services", label: "All Services", icon: <ClipboardList className="h-4 w-4" /> },
    { key: "add-service", label: "Add Service", icon: <Plus className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
        <div className="border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto">
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
        {activeTab === "home" && <HomeTab totalAppointments={totalAppointments} approved={approved} cancelled={cancelled} appointments={appointments} allDoctors={allDoctors} allServices={allServices} />}
        {activeTab === "all-doctors" && <AllDoctorsTab doctors={allDoctors} onRemove={removeDoctor} />}
        {activeTab === "add-doctor" && <AddDoctorTab onAdd={addDoctor} onDone={() => setActiveTab("all-doctors")} />}
        {activeTab === "all-services" && <AllServicesTab services={allServices} onRemove={removeService} />}
        {activeTab === "add-service" && <AddServiceTab onAdd={addService} onDone={() => setActiveTab("all-services")} />}
      </div>
    </div>
  );
}

function HomeTab({ totalAppointments, approved, cancelled, appointments, allDoctors, allServices }: { totalAppointments: number; approved: number; cancelled: number; appointments: any[]; allDoctors: any[]; allServices: any[] }) {
  const completedAppointments = appointments.filter((a: any) => a.status === "completed");
  const totalRevenue = completedAppointments.reduce((sum: number, a: any) => sum + a.doctor.fees, 0);
  
  // Get recent appointments
  const recentAppointments = [...appointments].reverse().slice(0, 5);

  // Get specialty distribution
  const specialtyCount: Record<string, number> = {};
  allDoctors.forEach((doc: any) => {
    specialtyCount[doc.specialty] = (specialtyCount[doc.specialty] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><CalendarDays className="h-6 w-6 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Total Appointments</p><p className="text-2xl font-bold text-foreground">{totalAppointments}</p></div>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10"><TrendingUp className="h-6 w-6 text-warning" /></div>
            <div><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold text-foreground">₹{totalRevenue}</p></div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Total Doctors</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{allDoctors.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Active doctors on platform</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Total Services</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{allServices.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Available health services</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <UserCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Completion Rate</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {totalAppointments > 0 ? Math.round((completedAppointments.length / totalAppointments) * 100) : 0}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">Appointments completed</p>
        </div>
      </div>

      {/* Doctor Specialty Distribution */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Doctors by Specialty</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(specialtyCount).map(([specialty, count]) => (
            <div key={specialty} className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
              <span className="text-sm font-medium text-foreground">{specialty}</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Appointments</h3>
        {recentAppointments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No appointments yet</p>
        ) : (
          <div className="space-y-3">
            {recentAppointments.map((apt: any) => (
              <div key={apt.id} className="flex items-center justify-between rounded-xl bg-secondary/30 p-4">
                <div className="flex items-center gap-3">
                  <img src={apt.doctor.image} alt={apt.doctor.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{apt.patientName || "Patient"}</p>
                    <p className="text-xs text-muted-foreground">{apt.doctor.name} • {apt.doctor.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    apt.status === "completed" ? "bg-green-100 text-green-700" :
                    apt.status === "cancelled" ? "bg-red-100 text-red-700" :
                    apt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(apt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AllDoctorsTab({ doctors, onRemove }: { doctors: any[]; onRemove: (id: string) => void }) {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-foreground">All Doctors ({doctors.length})</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {doctors.map((doc) => (
          <div key={doc.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="h-48 overflow-hidden bg-secondary">
              <img src={doc.image} alt={doc.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground">{doc.name}</h3>
              <p className="text-sm text-muted-foreground">{doc.specialty}</p>
              <p className="text-sm text-muted-foreground">{doc.degree} • {doc.experience}</p>
              <p className="text-sm text-muted-foreground">₹{doc.fees}/visit</p>
              <p className="text-xs text-muted-foreground mt-1">{doc.email}</p>
              <Button variant="outline" size="sm" onClick={() => onRemove(doc.id)} className="mt-3 w-full text-destructive hover:bg-destructive/10">
                <Trash2 className="mr-1 h-3 w-3" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddDoctorTab({ onAdd, onDone }: { onAdd: (doc: any) => void; onDone: () => void }) {
  const [form, setForm] = useState({
    name: "", email: "", specialty: "General physician", salary: "", address: "", phone: "", age: "", gender: "Male", fees: "", degree: "MBBS", experience: "1 Year", about: "", image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setForm({ ...form, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      alert("Please upload a photo of the doctor");
      return;
    }
    onAdd({
      ...form,
      fees: Number(form.fees) || 500,
      salary: Number(form.salary) || 50000,
      age: Number(form.age) || 30,
      available: true,
      address: { line1: form.address, line2: "" },
    });
    onDone();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-xl font-bold text-foreground">Add New Doctor</h2>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
        {/* Photo Upload */}
        <div>
          <Label>Doctor Photo *</Label>
          <div className="mt-2 flex items-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-secondary/50 transition-colors hover:border-primary"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Upload Photo</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <p className="text-sm text-muted-foreground">Click to upload doctor's photo. JPG, PNG supported.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div><Label>Department</Label>
            <Select value={form.specialty} onValueChange={(v) => setForm({ ...form, specialty: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{specialties.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Degree</Label><Input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} /></div>
          <div><Label>Experience</Label><Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} /></div>
          <div><Label>Fees (₹)</Label><Input type="number" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} required /></div>
          <div><Label>Salary (₹)</Label><Input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><Label>Age</Label><Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
          <div><Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
        <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        <div><Label>About</Label><Input value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} /></div>
        <Button type="submit" className="w-full rounded-full">Add Doctor</Button>
      </form>
    </div>
  );
}

function AllServicesTab({ services, onRemove }: { services: any[]; onRemove: (id: string) => void }) {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-foreground">All Services ({services.length})</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((srv) => (
          <div key={srv.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="h-40 overflow-hidden"><img src={srv.image} alt={srv.name} className="h-full w-full object-cover" /></div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground">{srv.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{srv.description}</p>
              <p className="mt-2 text-sm font-semibold text-foreground">₹{srv.price} • {srv.duration}</p>
              <Button variant="outline" size="sm" onClick={() => onRemove(srv.id)} className="mt-3 w-full text-destructive hover:bg-destructive/10">
                <Trash2 className="mr-1 h-3 w-3" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddServiceTab({ onAdd, onDone }: { onAdd: (srv: any) => void; onDone: () => void }) {
  const [form, setForm] = useState({ name: "", description: "", price: "", duration: "", image: "" });
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setForm({ ...form, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      alert("Please upload an image for the service");
      return;
    }
    onAdd({ ...form, price: Number(form.price) || 100, available: true });
    onDone();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-xl font-bold text-foreground">Add New Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
        {/* Image Upload */}
        <div>
          <Label>Service Image *</Label>
          <div className="mt-2 flex items-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex h-32 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-secondary/50 transition-colors hover:border-primary"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Upload Image</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <p className="text-sm text-muted-foreground">Click to upload service image. JPG, PNG supported.</p>
          </div>
        </div>

        <div><Label>Service Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
          <div><Label>Duration</Label><Input placeholder="e.g. 30 mins" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required /></div>
        </div>
        <Button type="submit" className="w-full rounded-full">Add Service</Button>
      </form>
    </div>
  );
}
