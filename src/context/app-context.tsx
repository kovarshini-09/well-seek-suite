import { createContext, useContext, useState, type ReactNode } from "react";
import { doctors as initialDoctors, services as initialServices, ADMIN_CREDENTIALS } from "@/lib/data";
import type { Doctor, Appointment, User, Service, ServiceBooking } from "@/lib/data";

export type { Doctor, Appointment, User, Service, ServiceBooking } from "@/lib/data";

type UserRole = "patient" | "doctor" | "admin" | null;

type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  userRole: UserRole;
  loggedInDoctor: Doctor | null;
  login: (email: string, password: string) => boolean;
  loginAsDoctor: (email: string, password: string) => boolean;
  loginAsAdmin: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  appointments: Appointment[];
  bookAppointment: (doctor: Doctor, date: string, time: string) => void;
  cancelAppointment: (id: string) => void;
  updateAppointmentStatus: (id: string, status: "pending" | "completed" | "cancelled") => void;
  serviceBookings: ServiceBooking[];
  bookService: (service: Service, date: string, time: string) => void;
  cancelServiceBooking: (id: string) => void;
  allDoctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, "id">) => void;
  removeDoctor: (id: string) => void;
  toggleDoctorAvailability: (id: string) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  allServices: Service[];
  addService: (service: Omit<Service, "id">) => void;
  removeService: (id: string) => void;
  toggleServiceAvailability: (id: string) => void;
  getDoctorEarnings: (doctorId: string) => number;
  getDoctorAppointments: (doctorId: string) => Appointment[];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loggedInDoctor, setLoggedInDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [queueCounter, setQueueCounter] = useState(1);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>(initialDoctors);
  const [allServices, setAllServices] = useState<Service[]>(initialServices);

  const login = (email: string, password: string) => {
    if (email && password) {
      setUser({
        name: "Edward Vincent",
        email,
        phone: "+91 234 567 8900",
        address: "57th Cross, Richmond Circle, Church Road, Chennai",
        gender: "Male",
        birthday: "20 July 1996",
        image: "",
      });
      setUserRole("patient");
      setLoggedInDoctor(null);
      return true;
    }
    return false;
  };

  const loginAsDoctor = (email: string, password: string) => {
    const doctor = allDoctors.find((d) => d.email === email);
    if (doctor && password) {
      setUser({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone || "",
        address: `${doctor.address.line1}, ${doctor.address.line2}`,
        gender: doctor.gender || "",
        birthday: "",
        image: doctor.image,
      });
      setUserRole("doctor");
      setLoggedInDoctor(doctor);
      return true;
    }
    return false;
  };

  const loginAsAdmin = (email: string, password: string) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser({
        name: "Admin",
        email: ADMIN_CREDENTIALS.email,
        phone: "",
        address: "",
        gender: "",
        birthday: "",
        image: "",
      });
      setUserRole("admin");
      setLoggedInDoctor(null);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setLoggedInDoctor(null);
  };

  const register = (name: string, email: string, password: string) => {
    if (name && email && password) {
      setUser({ name, email, phone: "", address: "", gender: "", birthday: "", image: "" });
      setUserRole("patient");
      return true;
    }
    return false;
  };

  const bookAppointment = (doctor: Doctor, date: string, time: string) => {
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      doctor,
      date,
      time,
      status: "upcoming",
      patientName: user?.name || "Patient",
      patientEmail: user?.email || "",
    };
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, status: "cancelled" as const } : apt)));
  };

  const updateAppointmentStatus = (id: string, status: "pending" | "completed" | "cancelled") => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, status } : apt)));
  };

  const bookService = (service: Service, date: string, time: string) => {
    const currentQueue = queueCounter;
    setQueueCounter((prev) => prev + 1);
    const durationMinutes = parseInt(service.duration) || 15;
    const estimatedWait = (currentQueue - 1) * durationMinutes + Math.floor(Math.random() * 10);
    const newBooking: ServiceBooking = {
      id: `srv-${Date.now()}`,
      service,
      date,
      time,
      status: "upcoming",
      queueNumber: currentQueue,
      estimatedWaitTime: estimatedWait,
    };
    setServiceBookings((prev) => [...prev, newBooking]);
  };

  const cancelServiceBooking = (id: string) => {
    setServiceBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b)));
  };

  const addDoctor = (doctor: Omit<Doctor, "id">) => {
    const newDoctor = { ...doctor, id: `doc-${Date.now()}` } as Doctor;
    setAllDoctors((prev) => [...prev, newDoctor]);
  };

  const removeDoctor = (id: string) => {
    setAllDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleDoctorAvailability = (id: string) => {
    setAllDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, available: !d.available } : d)));
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setAllDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    if (loggedInDoctor && loggedInDoctor.id === id) {
      setLoggedInDoctor((prev) => prev ? { ...prev, ...updates } : prev);
    }
  };

  const addService = (service: Omit<Service, "id">) => {
    const newService = { ...service, id: `srv-${Date.now()}` } as Service;
    setAllServices((prev) => [...prev, newService]);
  };

  const removeService = (id: string) => {
    setAllServices((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleServiceAvailability = (id: string) => {
    setAllServices((prev) => prev.map((s) => (s.id === id ? { ...s, available: !s.available } : s)));
  };

  const getDoctorEarnings = (doctorId: string) => {
    return appointments
      .filter((apt) => apt.doctor.id === doctorId && apt.status === "completed")
      .reduce((sum, apt) => sum + apt.doctor.fees, 0);
  };

  const getDoctorAppointments = (doctorId: string) => {
    return appointments.filter((apt) => apt.doctor.id === doctorId);
  };

  return (
    <AppContext.Provider
      value={{
        user, setUser, isLoggedIn: !!user, userRole, loggedInDoctor,
        login, loginAsDoctor, loginAsAdmin, logout, register,
        appointments, bookAppointment, cancelAppointment, updateAppointmentStatus,
        serviceBookings, bookService, cancelServiceBooking,
        allDoctors, addDoctor, removeDoctor, toggleDoctorAvailability, updateDoctor,
        allServices, addService, removeService, toggleServiceAvailability,
        getDoctorEarnings, getDoctorAppointments,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
