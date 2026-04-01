"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Lock, User, Mail, Save, Eye, EyeOff, Shield, Key } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import toast from "react-hot-toast";

const S = {
  page:  { padding:"1.5rem", maxWidth:640 } as React.CSSProperties,
  card:  { background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, padding:"1.5rem", boxShadow:"var(--shadow-sm)", marginBottom:"1.25rem" } as React.CSSProperties,
  label: { display:"block", fontSize:"0.8rem", fontWeight:600, color:"var(--txt-muted)", marginBottom:6 } as React.CSSProperties,
  iconBox: (color: string, bg: string) => ({ width:44, height:44, borderRadius:13, background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 } as React.CSSProperties),
};

export default function SettingsPage() {
  const [pf, setPf] = useState({ newUsername:"", email:"" });
  const [pw, setPw] = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [showCurr, setShowCurr] = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [saving,   setSaving]   = useState(false);

  const token   = () => typeof window !== "undefined" ? localStorage.getItem("cairn_admin_token") : "";
  const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

  const saveProfile = async () => {
    if (!pf.newUsername && !pf.email) return toast.error("Enter a new username or email");
    setSaving(true);
    const res = await fetch("/api/admin/settings", { method:"PUT", headers:headers(), body:JSON.stringify({ newUsername:pf.newUsername, email:pf.email }) }).then(r => r.json());
    if (res.success) { toast.success("Profile updated!"); if (res.token) localStorage.setItem("cairn_admin_token", res.token); setPf({ newUsername:"", email:"" }); }
    else toast.error(res.message || "Failed to update");
    setSaving(false);
  };

  const savePassword = async () => {
    if (!pw.currentPassword || !pw.newPassword) return toast.error("All password fields required");
    if (pw.newPassword !== pw.confirmPassword) return toast.error("New passwords don't match");
    if (pw.newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    setSaving(true);
    const res = await fetch("/api/admin/settings", { method:"PUT", headers:headers(), body:JSON.stringify({ currentPassword:pw.currentPassword, newPassword:pw.newPassword }) }).then(r => r.json());
    if (res.success) { toast.success("Password changed successfully!"); if (res.token) localStorage.setItem("cairn_admin_token", res.token); setPw({ currentPassword:"", newPassword:"", confirmPassword:"" }); }
    else toast.error(res.message || "Failed to change password");
    setSaving(false);
  };

  const PasswordInput = ({ label, val, onChange, show, toggle, placeholder }: { label:string; val:string; onChange:(v:string)=>void; show:boolean; toggle?:()=>void; placeholder?:string }) => (
    <div>
      <label style={S.label}>{label}</label>
      <div style={{ position:"relative" }}>
        <Lock size={14} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"var(--txt-faint)" }} />
        <input type={show ? "text" : "password"} className="input-field" style={{ paddingLeft:38, paddingRight: toggle ? 40 : 14 }} placeholder={placeholder || "••••••••"} value={val} onChange={e => onChange(e.target.value)} />
        {toggle && (
          <button type="button" onClick={toggle} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--txt-faint)", padding:0 }}>
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div style={S.page}>
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:"1.75rem" }}>
          <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"1.75rem", fontWeight:800, color:"var(--txt-primary)", display:"flex", alignItems:"center", gap:10 }}>
            <Settings size={26} color="var(--accent)" /> Settings
          </h1>
          <p style={{ color:"var(--txt-muted)", marginTop:4, fontSize:"0.875rem" }}>Manage your admin account and security</p>
        </motion.div>

        {/* Profile */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} style={S.card}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:"1.5rem", paddingBottom:"1rem", borderBottom:"1px solid var(--border)" }}>
            <div style={S.iconBox("var(--accent)", "var(--accent-light)")}>
              <User size={20} color="var(--accent)" />
            </div>
            <div>
              <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1.05rem", color:"var(--txt-primary)" }}>Profile Settings</h2>
              <p style={{ fontSize:"0.8rem", color:"var(--txt-muted)", marginTop:2 }}>Update your admin username or email address</p>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div>
              <label style={S.label}>New Username</label>
              <div style={{ position:"relative" }}>
                <User size={14} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"var(--txt-faint)" }} />
                <input className="input-field" style={{ paddingLeft:38 }} placeholder="Enter new username" value={pf.newUsername} onChange={e => setPf({ ...pf, newUsername:e.target.value })} />
              </div>
            </div>
            <div>
              <label style={S.label}>Email Address</label>
              <div style={{ position:"relative" }}>
                <Mail size={14} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"var(--txt-faint)" }} />
                <input className="input-field" style={{ paddingLeft:38 }} type="email" placeholder="admin@cairntech.com" value={pf.email} onChange={e => setPf({ ...pf, email:e.target.value })} />
              </div>
            </div>
            <div>
              <button onClick={saveProfile} disabled={saving} className="btn-primary" style={{ display:"flex", alignItems:"center", gap:6 }}>
                <Save size={15} /> {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Password */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }} style={S.card}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:"1.5rem", paddingBottom:"1rem", borderBottom:"1px solid var(--border)" }}>
            <div style={S.iconBox("var(--amber)", "rgba(201,124,42,0.1)")}>
              <Key size={20} color="var(--amber)" />
            </div>
            <div>
              <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1.05rem", color:"var(--txt-primary)" }}>Change Password</h2>
              <p style={{ fontSize:"0.8rem", color:"var(--txt-muted)", marginTop:2 }}>Use a strong, unique password with 6+ characters</p>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <PasswordInput label="Current Password" val={pw.currentPassword} onChange={v => setPw({ ...pw, currentPassword:v })} show={showCurr} toggle={() => setShowCurr(!showCurr)} />
            <PasswordInput label="New Password" val={pw.newPassword} onChange={v => setPw({ ...pw, newPassword:v })} show={showNew} toggle={() => setShowNew(!showNew)} placeholder="Min 6 characters" />
            <PasswordInput label="Confirm New Password" val={pw.confirmPassword} onChange={v => setPw({ ...pw, confirmPassword:v })} show={false} placeholder="Repeat new password" />
            <div>
              <button onClick={savePassword} disabled={saving} className="btn-primary" style={{ display:"flex", alignItems:"center", gap:6 }}>
                <Lock size={15} /> {saving ? "Saving..." : "Change Password"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Security tips */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.16 }}
          style={{ background:"var(--accent-light)", border:"1px solid var(--accent)", borderRadius:14, padding:"1.25rem", display:"flex", gap:12 }}>
          <Shield size={18} color="var(--accent)" style={{ flexShrink:0, marginTop:2 }} />
          <div>
            <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.875rem", color:"var(--accent-text)", marginBottom:8 }}>Security Recommendations</div>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:5 }}>
              {[
                "Use a unique password not used on other sites",
                "Change your default password immediately after setup",
                "Never share admin credentials with untrusted parties",
                "Admin sessions expire automatically after 7 days",
              ].map((tip, i) => (
                <li key={i} style={{ fontSize:"0.8rem", color:"var(--accent-text)", opacity:0.8, display:"flex", alignItems:"flex-start", gap:6 }}>
                  <span style={{ flexShrink:0 }}>·</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
