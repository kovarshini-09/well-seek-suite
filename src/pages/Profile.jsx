import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser, isLoggedIn } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", gender: "", birthday: "" });

  useEffect(() => {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (user) setFormData({ name: user.name || "", email: user.email || "", phone: user.phone || "", address: user.address || "", gender: user.gender || "", birthday: user.birthday || "" });
  }, [isLoggedIn, user, navigate]);

  if (!isLoggedIn || !user) return null;

  const handleSave = () => { setUser({ ...user, ...formData }); setIsEditing(false); };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-border bg-card p-8">
        <div className="mb-8 flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-primary text-3xl font-bold text-primary-foreground">{user.name?.charAt(0) || "U"}</div>
          <div>{isEditing ? <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="text-xl font-semibold" /> : <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>}</div>
        </div>
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact Information</h2>
          <div className="grid gap-4">
            <div className="grid gap-2"><Label className="text-muted-foreground">Email</Label>{isEditing ? <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /> : <p className="text-foreground">{user.email || "Not provided"}</p>}</div>
            <div className="grid gap-2"><Label className="text-muted-foreground">Phone</Label>{isEditing ? <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /> : <p className="text-foreground">{user.phone || "Not provided"}</p>}</div>
            <div className="grid gap-2"><Label className="text-muted-foreground">Address</Label>{isEditing ? <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /> : <p className="text-foreground">{user.address || "Not provided"}</p>}</div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2"><Label className="text-muted-foreground">Gender</Label>{isEditing ? <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select> : <p className="text-foreground">{user.gender || "Not provided"}</p>}</div>
            <div className="grid gap-2"><Label className="text-muted-foreground">Birthday</Label>{isEditing ? <Input value={formData.birthday} onChange={(e) => setFormData({ ...formData, birthday: e.target.value })} /> : <p className="text-foreground">{user.birthday || "Not provided"}</p>}</div>
          </div>
        </div>
        <div className="flex gap-3">
          {isEditing ? (<><Button onClick={handleSave} className="rounded-full px-8">Save information</Button><Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-full px-8">Cancel</Button></>) : (<Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-full px-8">Edit</Button>)}
        </div>
      </div>
    </div>
  );
}
