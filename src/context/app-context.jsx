import { createContext, useContext, useState } from "react";
import { doctors as initialDoctors, services as initialServices, ADMIN_CREDENTIALS } from "@/lib/data";
const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loggedInDoctor, setLoggedInDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [queueCounter, setQueueCounter] = useState(1);
  const [allDoctors, setAllDoctors] = useState(initialDoctors);
  const [allServices, setAllServices] = useState(initialServices);

  const login = (email, password) => {
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

  const loginAsDoctor = (email, password) => {
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

  const loginAsAdmin = (email, password) => {
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

  const register = (name, email, password) => {
    if (name && email && password) {
      setUser({ name, email, phone: "", address: "", gender: "", birthday: "", image: "" });
      setUserRole("patient");
      return true;
    }
    return false;
  };

  const bookAppointment = (doctor, date, time) => {
    const newAppointment = {
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

  const cancelAppointment = (id) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, status: "cancelled" } : apt)));
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, status } : apt)));
  };

  const bookService = (service, date, time) => {
    const currentQueue = queueCounter;
    setQueueCounter((prev) => prev + 1);
    const durationMinutes = parseInt(service.duration) || 15;
    const estimatedWait = (currentQueue - 1) * durationMinutes + Math.floor(Math.random() * 10);
    const newBooking = {
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

  const cancelServiceBooking = (id) => {
    setServiceBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
  };

  const addDoctor = (doctor) => {
    const newDoctor = { ...doctor, id: `doc-${Date.now()}` };
    setAllDoctors((prev) => [...prev, newDoctor]);
  };

  const removeDoctor = (id) => {
    setAllDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleDoctorAvailability = (id) => {
    setAllDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, available: !d.available } : d)));
  };

  const updateDoctor = (id, updates) => {
    setAllDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    if (loggedInDoctor && loggedInDoctor.id === id) {
      setLoggedInDoctor((prev) => prev ? { ...prev, ...updates } : prev);
    }
  };

  const addService = (service) => {
    const newService = { ...service, id: `srv-${Date.now()}` };
    setAllServices((prev) => [...prev, newService]);
  };

  const removeService = (id) => {
    setAllServices((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleServiceAvailability = (id) => {
    setAllServices((prev) => prev.map((s) => (s.id === id ? { ...s, available: !s.available } : s)));
  };

  const getDoctorEarnings = (doctorId) => {
    return appointments
      .filter((apt) => apt.doctor.id === doctorId && apt.status === "completed")
      .reduce((sum, apt) => sum + apt.doctor.fees, 0);
  };

  const getDoctorAppointments = (doctorId) => {
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
