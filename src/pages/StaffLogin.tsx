import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Stethoscope, ArrowLeft } from "lucide-react";

export default function StaffLoginPage() {
  const navigate = useNavigate();
  const { loginAsDoctor, loginAsAdmin } = useApp();
  const [mode, setMode] = useState<"select" | "admin" | "doctor">("select");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "admin") {
      const success = loginAsAdmin(email, password);
      if (success) navigate("/admin-dashboard");
      else setError("Invalid admin credentials");
    } else if (mode === "doctor") {
      const success = loginAsDoctor(email, password);
      if (success) navigate("/doctor-dashboard");
      else setError("Invalid doctor email. Use your registered email.");
    }
  };

  if (mode === "select") {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center px-4 py-12">
        <div className="w-full">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground">Staff Login</h1>
            <p className="mt-2 text-muted-foreground">Select your role to continue</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => setMode("admin")}
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Admin Login</h3>
                <p className="text-sm text-muted-foreground">Access admin dashboard</p>
              </div>
            </button>
            <button
              onClick={() => setMode("doctor")}
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Stethoscope className="h-7 w-7 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Doctor Login</h3>
                <p className="text-sm text-muted-foreground">Access doctor dashboard</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center px-4 py-12">
      <div className="w-full">
        <button onClick={() => setMode("select")} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            {mode === "admin" ? <ShieldCheck className="h-7 w-7 text-primary" /> : <Stethoscope className="h-7 w-7 text-primary" />}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{mode === "admin" ? "Admin Login" : "Doctor Login"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "admin" ? "Email: admin@prescripto.com | Pass: admin123" : "Use your registered doctor email"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full rounded-full">Login</Button>
        </form>
      </div>
    </div>
  );
}
