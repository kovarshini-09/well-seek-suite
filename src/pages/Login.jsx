import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (isLogin) {
      const success = login(formData.email, formData.password);
      if (success) navigate("/");
      else setError("Invalid email or password");
    } else {
      if (!formData.name) { setError("Please enter your name"); return; }
      const success = register(formData.name, formData.email, formData.password);
      if (success) navigate("/");
      else setError("Registration failed");
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center px-4 py-12">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">{isLogin ? "Login" : "Create Account"}</h1>
          <p className="mt-2 text-muted-foreground">{isLogin ? "Please log in to book appointment" : "Please sign up to book appointment"}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full rounded-full">{isLogin ? "Login" : "Create account"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? (
            <>Create a new account?{" "}<button type="button" onClick={() => setIsLogin(false)} className="font-medium text-primary hover:underline">Click here</button></>
          ) : (
            <>Already have an account?{" "}<button type="button" onClick={() => setIsLogin(true)} className="font-medium text-primary hover:underline">Login here</button></>
          )}
        </p>
      </div>
    </div>
  );
}
