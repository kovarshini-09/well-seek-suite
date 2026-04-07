import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Timer, Calendar, IndianRupee } from "lucide-react";

export default function MyAppointmentsPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user, appointments, cancelAppointment, serviceBookings, cancelServiceBooking } = useApp();
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const upcomingAppointments = appointments.filter((a) => a.status === "upcoming");
  const cancelledAppointments = appointments.filter((a) => a.status === "cancelled");
  const upcomingServices = serviceBookings.filter((s) => s.status === "upcoming");
  const cancelledServices = serviceBookings.filter((s) => s.status === "cancelled");

  // Real-time queue: count how many people booked the same doctor on the same date/time slot before this patient
  const getQueueInfo = (apt) => {
    const sameSlotAppointments = appointments.filter(
      (a) => a.doctor.id === apt.doctor.id && a.date === apt.date && a.time === apt.time && a.status !== "cancelled"
    );
    const myIndex = sameSlotAppointments.findIndex((a) => a.id === apt.id);
    const peopleAhead = myIndex > 0 ? myIndex : 0;
    const avgConsultTime = 15; // minutes per consultation
    const estimatedWait = peopleAhead * avgConsultTime;
    const position = myIndex + 1;
    return { peopleAhead, estimatedWait, position };
  };

  // Real-time queue for services
  const getServiceQueueInfo = (booking) => {
    const sameSlotBookings = serviceBookings.filter(
      (b) => b.service.id === booking.service.id && b.date === booking.date && b.time === booking.time && b.status !== "cancelled"
    );
    const myIndex = sameSlotBookings.findIndex((b) => b.id === booking.id);
    const peopleAhead = myIndex > 0 ? myIndex : 0;
    const durationMinutes = parseInt(booking.service.duration) || 15;
    const estimatedWait = peopleAhead * durationMinutes;
    const position = myIndex + 1;
    return { peopleAhead, estimatedWait, position };
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-bold text-foreground">My Appointments</h1>
      <p className="mb-8 text-muted-foreground">Manage your doctor appointments and service bookings</p>

      <div className="mb-8 flex gap-3">
        <button onClick={() => setActiveTab("appointments")} className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${activeTab === "appointments" ? "bg-primary text-primary-foreground shadow-lg" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
          Doctor Appointments ({appointments.length})
        </button>
        <button onClick={() => setActiveTab("services")} className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${activeTab === "services" ? "bg-primary text-primary-foreground shadow-lg" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
          Service Bookings ({serviceBookings.length})
        </button>
      </div>

      {activeTab === "appointments" && (
        <>
          {appointments.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary"><Calendar className="h-8 w-8 text-muted-foreground" /></div>
              <h3 className="text-lg font-semibold text-foreground">No appointments yet</h3>
              <p className="mt-2 text-muted-foreground">Book your first appointment with a doctor</p>
              <Button onClick={() => navigate("/doctors")} className="mt-6 rounded-full">Find a Doctor</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {[...upcomingAppointments, ...cancelledAppointments].map((apt) => {
                const queueInfo = getQueueInfo(apt);
                return (
                  <div key={apt.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex flex-col lg:flex-row">
                      <div className="relative h-64 w-full shrink-0 overflow-hidden bg-secondary lg:h-auto lg:w-72">
                        <img src={apt.doctor.image} alt={apt.doctor.name} className="h-full w-full object-cover object-top" />
                        {apt.status === "cancelled" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">CANCELLED</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-foreground">{apt.doctor.name}</h3>
                            <p className="mt-1 text-primary">{apt.doctor.specialty}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{apt.doctor.degree} | {apt.doctor.experience} experience</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Consultation Fee</p>
                            <p className="flex items-center justify-end text-xl font-bold text-foreground"><IndianRupee className="h-5 w-5" />{apt.doctor.fees}</p>
                          </div>
                        </div>

                        {/* Real-time Queue Prediction */}
                        {apt.status === "upcoming" && (
                          <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Timer className="h-5 w-5 text-primary" />
                              <span className="font-semibold text-foreground">Queue Prediction</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-2xl font-bold text-primary">{queueInfo.peopleAhead}</p>
                                <p className="text-xs text-muted-foreground">People Ahead</p>
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-warning">
                                  {queueInfo.estimatedWait > 0 ? `${queueInfo.estimatedWait} min` : "0 min"}
                                </p>
                                <p className="text-xs text-muted-foreground">Est. Wait Time</p>
                              </div>
                              <div>
                                {queueInfo.peopleAhead === 0 ? (
                                  <p className="text-lg font-bold text-success">You're first! 🎉</p>
                                ) : (
                                  <p className="text-2xl font-bold text-success">#{queueInfo.position}</p>
                                )}
                                <p className="text-xs text-muted-foreground">Your Position</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div className="rounded-xl bg-secondary/50 p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"><Calendar className="h-5 w-5 text-primary" /></div>
                              <div><p className="text-xs text-muted-foreground">Date</p><p className="font-semibold text-foreground">{formatDate(apt.date)}</p></div>
                            </div>
                          </div>
                          <div className="rounded-xl bg-secondary/50 p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"><Clock className="h-5 w-5 text-primary" /></div>
                              <div><p className="text-xs text-muted-foreground">Time</p><p className="font-semibold text-foreground">{apt.time}</p></div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {apt.doctor.address.line1}, {apt.doctor.address.line2}
                        </div>
                        {apt.status === "upcoming" && (
                          <div className="mt-6 flex flex-wrap gap-3">
                            <Button className="rounded-full px-8"><IndianRupee className="mr-1 h-4 w-4" />Pay Online</Button>
                            <Button variant="outline" className="rounded-full px-8" onClick={() => cancelAppointment(apt.id)}>Cancel Appointment</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === "services" && (
        <>
          {serviceBookings.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-16 text-center">
              <h3 className="text-lg font-semibold text-foreground">No service bookings yet</h3>
              <Button onClick={() => navigate("/services")} className="mt-6 rounded-full">Browse Services</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {[...upcomingServices, ...cancelledServices].map((booking) => {
                const queueInfo = getServiceQueueInfo(booking);
                return (
                  <div key={booking.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-48 shrink-0 overflow-hidden sm:h-auto sm:w-48">
                        <img src={booking.service.image} alt={booking.service.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 p-6">
                        <h3 className="text-lg font-bold text-foreground">{booking.service.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(booking.date)}</span>
                          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{booking.time}</span>
                        </div>
                        {booking.status === "upcoming" && (
                          <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-4">
                            <div className="flex items-center gap-2 mb-2"><Users className="h-5 w-5 text-primary" /><span className="font-semibold text-foreground">Queue Info</span></div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-xl font-bold text-primary">#{queueInfo.position}</p>
                                <p className="text-xs text-muted-foreground">Queue No.</p>
                              </div>
                              <div>
                                <p className="text-xl font-bold text-warning">{queueInfo.estimatedWait > 0 ? `${queueInfo.estimatedWait} min` : "0 min"}</p>
                                <p className="text-xs text-muted-foreground">Wait Time</p>
                              </div>
                              <div>
                                {queueInfo.peopleAhead === 0 ? (
                                  <p className="text-lg font-bold text-success">You're first! 🎉</p>
                                ) : (
                                  <p className="text-xl font-bold text-primary">{queueInfo.peopleAhead} ahead</p>
                                )}
                                <p className="text-xs text-muted-foreground">People Ahead</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {booking.status === "upcoming" && (
                          <Button variant="outline" className="mt-4 rounded-full" onClick={() => cancelServiceBooking(booking.id)}>Cancel Booking</Button>
                        )}
                        {booking.status === "cancelled" && <span className="mt-4 inline-block rounded-full bg-destructive/10 px-4 py-1 text-sm text-destructive">Cancelled</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
